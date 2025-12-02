import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Propiedad } from '../../shared/models/propiedad';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/api/propiedades';

@Injectable({ providedIn: 'root' })
export class PropiedadService {

  constructor(private http: HttpClient) {}

  crear(propiedad: Propiedad, usuarioId: number): Observable<any> {
    const payload = { ...propiedad, usuarioId };
    return this.http.post(API_URL, payload);
  }

  listarPorUsuario(usuarioId: number): Observable<Propiedad[]> {
    return this.http.get<Propiedad[]>(`${API_URL}/usuario/${usuarioId}`);
  }
}
