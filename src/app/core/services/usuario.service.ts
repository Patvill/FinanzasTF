import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/api/usuarios';

export interface UsuarioRegistro {
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
  tipoDocumento: string;
  numeroDocumento: string;
  telefono: string;
  ingresoMensual: number;
  situacionLaboral: string;
  edad: number;
  estadoCivil: string;
}

export interface UsuarioLogin {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {

  constructor(private http: HttpClient) {}

  registrar(data: UsuarioRegistro): Observable<any> {
    return this.http.post(`${API_URL}/registrar`, data);
  }

  login(data: UsuarioLogin): Observable<any> {
    return this.http.post(`${API_URL}/login`, data);
  }
}
