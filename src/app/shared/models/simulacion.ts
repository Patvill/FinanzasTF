import { Propiedad } from './propiedad';
import { ProductoCredito } from './producto-credito';

export interface SimulacionRequest {
  usuarioId: number;
  propiedadId: number;
  productoId: number;
  bancoId: number;
  periodoGracia: number;
  montoSolicitado: number;

  // Nuevos campos opcionales del backend
  moneda?: string;                   // "PEN" o "USD"
  tipoTasa?: string;                 // "EFECTIVA" o "NOMINAL"
  tasaAnual?: number | null;         // TEA o TNA
  capitalizacionPorAnio?: number;    // solo si es nominal
}

export interface SimulacionHipoteca {
  id: number;
  montoSolicitado: number;
  cuotaMensual: number;
  numeroCuotas: number;
  tasaMensual: number;
  tcea: number;
  moneda: string;
  tipoTasa: string;
  tasaAnual: number;
  van: number;
  tir: number;
  fechaSimulacion: string;
}

