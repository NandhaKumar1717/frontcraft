export interface Shipment {
  id: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  status: 'pending' | 'in-transit' | 'delivered' | 'delayed';
  estimatedDelivery: Date;
  actualDelivery?: Date;
  weight: number;
  value: number;
  carrier: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
}

export interface ShipmentStats {
  totalShipments: number;
  inTransit: number;
  delivered: number;
  delayed: number;
  onTimeDeliveryRate: number;
  totalValue: number;
}

export interface SearchFilters {
  status?: string;
  carrier?: string;
  priority?: string;
  dateFrom?: Date;
  dateTo?: Date;
  searchTerm?: string;
}