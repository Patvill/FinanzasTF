import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SimulacionHipoteca, SimulacionRequest } from '../../shared/models/simulacion';
import { ProductoCredito } from '../../shared/models/producto-credito';

// Definimos CuotaProgramada localmente
export interface CuotaProgramada {
  id: number;
  numeroCuota: number;
  fechaVencimiento: string;
  cuotaTotal: number;
  montoCapital: number;
  montoInteres: number;
  saldoRestante: number;
}

@Injectable({
  providedIn: 'root'
})
export class SimulacionService {

  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  listarProductos(): Observable<ProductoCredito[]> {
    return this.http.get<ProductoCredito[]>(`${this.apiUrl}/productos-credito`);
  }

  crearSimulacion(request: SimulacionRequest): Observable<SimulacionHipoteca> {
    return this.http.post<SimulacionHipoteca>(`${this.apiUrl}/simulaciones`, request);
  }

  obtenerCuotas(simulacionId: number): Observable<CuotaProgramada[]> {
    return this.http.get<CuotaProgramada[]>(`${this.apiUrl}/simulaciones/${simulacionId}/cuotas`);
  }
}
