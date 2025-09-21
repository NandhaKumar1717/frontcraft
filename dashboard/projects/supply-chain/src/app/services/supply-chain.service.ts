import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SupplyChainService {

  constructor(private http: HttpClient) {}

  getShipments(): Observable<any[]> {
    return this.http.get<any>('/assets/data/shipments-200.json')
      .pipe(map(data => data.shipments));
  }

  getMetrics(): Observable<any> {
    return this.http.get<any>('/assets/data/shipments-200.json')
      .pipe(map(data => data.metrics));
  }
}