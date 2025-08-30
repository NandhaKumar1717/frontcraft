import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Shipment, ShipmentStats, SearchFilters } from '../models/shipment.model';

@Injectable({
  providedIn: 'root'
})
export class SupplyChainService {
  private shipmentsSubject = new BehaviorSubject<Shipment[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  shipments$ = this.shipmentsSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor() {
    this.loadMockData();
  }

  private loadMockData(): void {
    const mockShipments: Shipment[] = [
      {
        id: '1',
        trackingNumber: 'SC001234567',
        origin: 'Shanghai, China',
        destination: 'Los Angeles, USA',
        status: 'in-transit',
        estimatedDelivery: new Date('2024-08-30'),
        weight: 2500,
        value: 125000,
        carrier: 'DHL Express',
        priority: 'high',
        createdAt: new Date('2024-08-15')
      },
      {
        id: '2',
        trackingNumber: 'SC001234568',
        origin: 'Mumbai, India',
        destination: 'London, UK',
        status: 'delivered',
        estimatedDelivery: new Date('2024-08-20'),
        actualDelivery: new Date('2024-08-19'),
        weight: 1800,
        value: 89000,
        carrier: 'FedEx',
        priority: 'medium',
        createdAt: new Date('2024-08-10')
      },
      {
        id: '3',
        trackingNumber: 'SC001234569',
        origin: 'Frankfurt, Germany',
        destination: 'Tokyo, Japan',
        status: 'delayed',
        estimatedDelivery: new Date('2024-08-25'),
        weight: 3200,
        value: 156000,
        carrier: 'UPS',
        priority: 'urgent',
        createdAt: new Date('2024-08-12')
      },
      {
        id: '4',
        trackingNumber: 'SC001234570',
        origin: 'São Paulo, Brazil',
        destination: 'Miami, USA',
        status: 'pending',
        estimatedDelivery: new Date('2024-09-05'),
        weight: 1200,
        value: 67000,
        carrier: 'DHL Express',
        priority: 'low',
        createdAt: new Date('2024-08-20')
      },
      {
        id: '5',
        trackingNumber: 'SC001234571',
        origin: 'Rotterdam, Netherlands',
        destination: 'New York, USA',
        status: 'in-transit',
        estimatedDelivery: new Date('2024-08-28'),
        weight: 4500,
        value: 234000,
        carrier: 'Maersk',
        priority: 'high',
        createdAt: new Date('2024-08-18')
      },
      {
        id: '6',
        trackingNumber: 'SC001234572',
        origin: 'Singapore',
        destination: 'Sydney, Australia',
        status: 'delivered',
        estimatedDelivery: new Date('2024-08-22'),
        actualDelivery: new Date('2024-08-21'),
        weight: 1900,
        value: 98000,
        carrier: 'FedEx',
        priority: 'medium',
        createdAt: new Date('2024-08-16')
      },
      {
        id: '7',
        trackingNumber: 'SC001234573',
        origin: 'Dubai, UAE',
        destination: 'Mumbai, India',
        status: 'pending',
        estimatedDelivery: new Date('2024-09-02'),
        weight: 800,
        value: 45000,
        carrier: 'Emirates SkyCargo',
        priority: 'low',
        createdAt: new Date('2024-08-21')
      },
      {
        id: '8',
        trackingNumber: 'SC001234574',
        origin: 'Hamburg, Germany',
        destination: 'Montreal, Canada',
        status: 'in-transit',
        estimatedDelivery: new Date('2024-08-29'),
        weight: 3800,
        value: 187000,
        carrier: 'Hapag-Lloyd',
        priority: 'high',
        createdAt: new Date('2024-08-17')
      },
      {
        id: '9',
        trackingNumber: 'SC001234575',
        origin: 'Busan, South Korea',
        destination: 'Long Beach, USA',
        status: 'delivered',
        estimatedDelivery: new Date('2024-08-23'),
        actualDelivery: new Date('2024-08-22'),
        weight: 5200,
        value: 298000,
        carrier: 'COSCO',
        priority: 'urgent',
        createdAt: new Date('2024-08-14')
      },
      {
        id: '10',
        trackingNumber: 'SC001234576',
        origin: 'Antwerp, Belgium',
        destination: 'Cape Town, South Africa',
        status: 'delayed',
        estimatedDelivery: new Date('2024-08-26'),
        weight: 2100,
        value: 112000,
        carrier: 'MSC',
        priority: 'medium',
        createdAt: new Date('2024-08-13')
      }
    ];

    this.shipmentsSubject.next(mockShipments);
  }

  getShipments(filters?: SearchFilters, page: number = 1, pageSize: number = 10): Observable<{data: Shipment[], total: number}> {
    this.loadingSubject.next(true);
    
    return of(this.shipmentsSubject.value).pipe(
      delay(500),
      map(shipments => {
        let filtered = [...shipments];

        if (filters) {
          if (filters.status) {
            filtered = filtered.filter(s => s.status === filters.status);
          }
          if (filters.carrier) {
            filtered = filtered.filter(s => s.carrier.toLowerCase().includes(filters.carrier!.toLowerCase()));
          }
          if (filters.priority) {
            filtered = filtered.filter(s => s.priority === filters.priority);
          }
          if (filters.searchTerm) {
            const term = filters.searchTerm.toLowerCase();
            filtered = filtered.filter(s => 
              s.trackingNumber.toLowerCase().includes(term) ||
              s.origin.toLowerCase().includes(term) ||
              s.destination.toLowerCase().includes(term)
            );
          }
        }

        const startIndex = (page - 1) * pageSize;
        const paginatedData = filtered.slice(startIndex, startIndex + pageSize);

        this.loadingSubject.next(false);
        return {
          data: paginatedData,
          total: filtered.length
        };
      })
    );
  }

  getStats(): Observable<ShipmentStats> {
    const shipments = this.shipmentsSubject.value;
    
    const stats: ShipmentStats = {
      totalShipments: shipments.length,
      inTransit: shipments.filter(s => s.status === 'in-transit').length,
      delivered: shipments.filter(s => s.status === 'delivered').length,
      delayed: shipments.filter(s => s.status === 'delayed').length,
      onTimeDeliveryRate: 94.2,
      totalValue: shipments.reduce((sum, s) => sum + s.value, 0)
    };

    return of(stats).pipe(delay(300));
  }

  addShipment(shipment: Omit<Shipment, 'id' | 'createdAt'>): Observable<Shipment> {
    const newShipment: Shipment = {
      ...shipment,
      id: Date.now().toString(),
      createdAt: new Date()
    };

    const currentShipments = this.shipmentsSubject.value;
    this.shipmentsSubject.next([...currentShipments, newShipment]);

    return of(newShipment).pipe(delay(500));
  }
}