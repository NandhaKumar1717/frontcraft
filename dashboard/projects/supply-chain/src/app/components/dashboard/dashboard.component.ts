import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { SupplyChainService } from '../../services/supply-chain.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('statusChart') statusChartRef!: ElementRef;
  @ViewChild('regionChart') regionChartRef!: ElementRef;
  @ViewChild('trendChart') trendChartRef!: ElementRef;
  
  metrics: any = {};
  shipmentData: any[] = [];
  statusChart!: Chart;
  regionChart!: Chart;
  trendChart!: Chart;
  selectedPeriod = '7D';
  
  recentAlerts = [
    { id: 1, type: 'warning', message: 'Shipment SC-2024-156 delayed by 2 days', time: '5 min ago', priority: 'high', read: false },
    { id: 2, type: 'success', message: '15 shipments delivered successfully', time: '12 min ago', priority: 'medium', read: false },
    { id: 3, type: 'info', message: 'New carrier partnership activated', time: '1 hour ago', priority: 'low', read: false },
    { id: 4, type: 'error', message: 'Payment failed for shipment SC-2024-142', time: '2 hours ago', priority: 'high', read: true },
    { id: 5, type: 'warning', message: 'Inventory low for Product SKU-789', time: '3 hours ago', priority: 'medium', read: false }
  ];

  unreadAlertsCount = this.recentAlerts.filter(alert => !alert.read).length;

  constructor(private supplyChainService: SupplyChainService, private router: Router) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createCharts();
      this.initializeFeatherIcons();
    }, 100);
  }

  loadData(): void {
    this.supplyChainService.getShipments().subscribe(data => {
      this.shipmentData = data;
      this.createCharts();
      setTimeout(() => this.initializeFeatherIcons(), 100);
    });

    this.supplyChainService.getMetrics().subscribe(data => {
      this.metrics = data;
      setTimeout(() => this.initializeFeatherIcons(), 100);
    });
  }

  createCharts(): void {
    if (this.shipmentData.length === 0) return;
    
    // Destroy existing charts
    if (this.statusChart) this.statusChart.destroy();
    if (this.regionChart) this.regionChart.destroy();
    if (this.trendChart) this.trendChart.destroy();
    
    this.createStatusChart();
    this.createRegionChart();
    this.createTrendChart();
    
    setTimeout(() => this.initializeFeatherIcons(), 200);
  }

  createStatusChart(): void {
    const statusCounts = this.shipmentData.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});

    const statusColors = {
      'Delivered': '#10b981',
      'In Transit': '#3b82f6', 
      'Processing': '#f59e0b',
      'Delayed': '#ef4444',
      'Pending': '#8b5cf6'
    };

    const labels = Object.keys(statusCounts);
    const colors = labels.map(label => statusColors[label as keyof typeof statusColors] || '#6b7280');

    this.statusChart = new Chart(this.statusChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: Object.values(statusCounts),
          backgroundColor: colors,
          borderWidth: 4,
          borderColor: '#ffffff',
          hoverBorderWidth: 6,
          hoverOffset: 12,
          hoverBackgroundColor: colors.map(color => color + 'CC')
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        animation: {
          animateRotate: true,
          duration: 1500
        },
        plugins: {
          legend: {
            position: 'right',
            align: 'center',
            onClick: (e: any, legendItem: any, legend: any) => {
              const index = legendItem.index;
              const chart = legend.chart;
              const meta = chart.getDatasetMeta(0);
              
              (meta.data[index] as any).hidden = !(meta.data[index] as any).hidden;
              chart.update();
            },
            labels: {
              padding: 15,
              usePointStyle: true,
              pointStyle: 'circle',
              font: {
                family: 'Montserrat',
                size: 13,
                weight: 600
              },
              color: '#374151',
              generateLabels: (chart: any) => {
                const data = chart.data;
                const total = (data.datasets[0].data as number[]).reduce((a: number, b: number) => a + b, 0);
                const meta = chart.getDatasetMeta(0);
                
                return data.labels.map((label: string, i: number) => {
                  const value = data.datasets[0].data[i] as number;
                  const percentage = ((value * 100) / total).toFixed(1);
                  const isHidden = (meta.data[i] as any).hidden;
                  
                  return {
                    text: `${label} (${percentage}%)`,
                    fillStyle: isHidden ? '#d1d5db' : data.datasets[0].backgroundColor[i],
                    strokeStyle: isHidden ? '#d1d5db' : data.datasets[0].backgroundColor[i],
                    pointStyle: 'circle',
                    hidden: false,
                    index: i,
                    fontColor: isHidden ? '#9ca3af' : '#374151',
                    textDecoration: isHidden ? 'line-through' : 'none'
                  };
                });
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(30, 41, 59, 0.95)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#64748b',
            borderWidth: 1,
            cornerRadius: 12,
            displayColors: true,
            titleFont: {
              family: 'Montserrat',
              size: 14,
              weight: 600
            },
            bodyFont: {
              family: 'Montserrat',
              size: 13,
              weight: 500
            },
            callbacks: {
              title: (context: any) => {
                return `Status: ${context[0].label}`;
              },
              label: (context: any) => {
                const total = (context.dataset.data as number[]).reduce((a: number, b: number) => a + b, 0);
                const percentage = ((context.parsed * 100) / total).toFixed(1);
                return [`Count: ${context.parsed}`, `Percentage: ${percentage}%`];
              }
            }
          }
        }
      }
    });
  }

  createRegionChart(): void {
    const regionCounts = this.shipmentData.reduce((acc, item) => {
      acc[item.region] = (acc[item.region] || 0) + 1;
      return acc;
    }, {});

    const total = (Object.values(regionCounts) as number[]).reduce((a: number, b: number) => a + b, 0);
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316'];

    this.regionChart = new Chart(this.regionChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: Object.keys(regionCounts),
        datasets: [{
          label: 'Shipments by Region',
          data: Object.values(regionCounts),
          backgroundColor: colors.slice(0, Object.keys(regionCounts).length),
          borderRadius: 8,
          borderSkipped: false,
          borderWidth: 2,
          borderColor: 'rgba(255, 255, 255, 0.8)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1500,
          easing: 'easeOutQuart'
        },
        onClick: (event: any, elements: any) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const meta = this.regionChart.getDatasetMeta(0);
            const element = meta.data[index] as any;
            element.hidden = !element.hidden;
            this.regionChart.update();
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: '#f3f4f6'
            },
            ticks: {
              font: {
                family: 'Montserrat',
                size: 11
              },
              color: '#6b7280',
              callback: function(value) {
                return value + ' shipments';
              }
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                family: 'Montserrat',
                size: 11,
                weight: 500
              },
              color: '#374151'
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(30, 41, 59, 0.95)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#64748b',
            borderWidth: 1,
            cornerRadius: 12,
            displayColors: true,
            titleFont: {
              family: 'Montserrat',
              size: 14,
              weight: 600
            },
            bodyFont: {
              family: 'Montserrat',
              size: 13,
              weight: 500
            },
            callbacks: {
              title: (context: any) => {
                return `Region: ${context[0].label}`;
              },
              label: (context: any) => {
                const percentage = ((context.parsed.y * 100) / total).toFixed(1);
                return [`Shipments: ${context.parsed.y}`, `Percentage: ${percentage}%`];
              }
            }
          }
        }
      }
    });
  }

  createTrendChart(): void {
    const days = this.selectedPeriod === '7D' ? 7 : this.selectedPeriod === '30D' ? 30 : 90;
    const dateRange = Array.from({length: days}, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const trendData = dateRange.map((_, index) => {
      const baseValue = 35;
      const seasonalVariation = Math.sin(index / days * Math.PI * 2) * 10;
      const randomVariation = (Math.random() - 0.5) * 15;
      return Math.max(10, Math.floor(baseValue + seasonalVariation + randomVariation));
    });

    const movingAverage = trendData.map((_, index) => {
      const start = Math.max(0, index - 2);
      const end = Math.min(trendData.length, index + 3);
      const subset = trendData.slice(start, end);
      return subset.reduce((sum, val) => sum + val, 0) / subset.length;
    });

    this.trendChart = new Chart(this.trendChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: dateRange.map(date => {
          const d = new Date(date);
          return days <= 7 ? d.toLocaleDateString('en-US', { weekday: 'short' }) :
                 days <= 30 ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) :
                 d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }),
        datasets: [
          {
            label: 'Daily Shipments',
            data: trendData,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            borderWidth: 2,
            pointBackgroundColor: '#3b82f6',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: days <= 7 ? 5 : days <= 30 ? 3 : 2,
            pointHoverRadius: 7,
            tension: 0.4
          },
          {
            label: 'Trend Line',
            data: movingAverage,
            borderColor: '#10b981',
            backgroundColor: 'transparent',
            fill: false,
            borderWidth: 3,
            pointRadius: 0,
            pointHoverRadius: 0,
            tension: 0.4,
            borderDash: [5, 5]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1500,
          easing: 'easeOutQuart'
        },
        interaction: {
          intersect: false,
          mode: 'index'
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: '#f3f4f6'
            },
            ticks: {
              font: {
                family: 'Montserrat',
                size: 11
              },
              color: '#6b7280',
              callback: function(value) {
                return value + ' shipments';
              }
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                family: 'Montserrat',
                size: 10
              },
              color: '#374151',
              maxTicksLimit: days <= 7 ? 7 : days <= 30 ? 10 : 12
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
              usePointStyle: true,
              font: {
                family: 'Montserrat',
                size: 11
              },
              color: '#6b7280'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(30, 41, 59, 0.95)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#64748b',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
            callbacks: {
              title: function(context) {
                return `Date: ${context[0].label}`;
              },
              label: function(context) {
                return `${context.dataset.label}: ${context.parsed.y} shipments`;
              }
            }
          }
        }
      }
    });
  }

  getAlertIcon(type: string): string {
    const icons = {
      warning: 'alert-triangle',
      success: 'check-circle',
      info: 'info',
      error: 'x-circle'
    };
    return icons[type as keyof typeof icons] || 'info';
  }

  initializeFeatherIcons(): void {
    try {
      if (typeof (window as any).feather !== 'undefined') {
        (window as any).feather.replace();
      } else {
        setTimeout(() => {
          if (typeof (window as any).feather !== 'undefined') {
            (window as any).feather.replace();
          }
        }, 500);
      }
    } catch (error) {
      console.log('Feather icons not available');
    }
  }

  refreshChart(chartType: string): void {
    if (chartType === 'status') {
      if (this.statusChart) this.statusChart.destroy();
      this.createStatusChart();
    } else if (chartType === 'region') {
      if (this.regionChart) this.regionChart.destroy();
      this.createRegionChart();
    } else if (chartType === 'trend') {
      if (this.trendChart) this.trendChart.destroy();
      this.createTrendChart();
    }
    setTimeout(() => this.initializeFeatherIcons(), 100);
  }

  exportChart(chartType: string): void {
    let chart;
    let filename = 'chart.png';
    
    if (chartType === 'status') {
      chart = this.statusChart;
      filename = 'status-chart.png';
    } else if (chartType === 'region') {
      chart = this.regionChart;
      filename = 'region-chart.png';
    } else if (chartType === 'trend') {
      chart = this.trendChart;
      filename = 'trend-chart.png';
    }
    
    if (chart) {
      const link = document.createElement('a');
      link.download = filename;
      link.href = chart.toBase64Image();
      link.click();
    }
  }

  changePeriod(period: string): void {
    this.selectedPeriod = period;
    if (this.trendChart) this.trendChart.destroy();
    this.createTrendChart();
    setTimeout(() => this.initializeFeatherIcons(), 100);
  }

  toggleFullscreen(chartType: string): void {
    const chartCard = document.querySelector(`[data-chart="${chartType}"]`) as HTMLElement;
    if (chartCard) {
      if (!document.fullscreenElement) {
        chartCard.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  }

  // Alert functionality
  markAsRead(alertId: number): void {
    const alert = this.recentAlerts.find(a => a.id === alertId);
    if (alert) {
      alert.read = true;
      this.updateUnreadCount();
    }
  }

  dismissAlert(alertId: number): void {
    this.recentAlerts = this.recentAlerts.filter(a => a.id !== alertId);
    this.updateUnreadCount();
  }

  updateUnreadCount(): void {
    this.unreadAlertsCount = this.recentAlerts.filter(alert => !alert.read).length;
  }

  viewAllAlerts(): void {
    console.log('Alerts page not implemented yet');
  }

  // Quick Actions functionality
  viewAllShipments(): void {
    this.router.navigate(['/shipments']);
  }

  generateReport(): void {
    console.log('Generating report...');
    const reportData = {
      totalShipments: this.metrics?.activeShipments || 0,
      onTimeDelivery: this.metrics?.onTimeDeliveryRate || 0,
      totalValue: this.metrics?.totalValue || 0,
      avgTransitTime: this.metrics?.averageDeliveryTime || 0,
      generatedAt: new Date().toISOString()
    };
    
    // Create and download report
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `supply-chain-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }


}