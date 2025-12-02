import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';

import { Propiedad } from '../../../shared/models/propiedad';
import { PropiedadService } from '../../../core/services/propiedad.service';
import { SimulacionService, CuotaProgramada } from '../../../core/services/simulacion.service';
import { ProductoCredito } from '../../../shared/models/producto-credito';
import { SimulacionHipoteca, SimulacionRequest} from '../../../shared/models/simulacion';

interface BancoOpcion {
  id: number;
  nombre: string;
  tea: number;
  maxGracia: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  usuario: any;

  // ------- VIVIENDAS -------
  propiedadModelo: Propiedad = {
    direccion: '',
    tipo: 'Departamento',
    valor: 0,
    descripcion: ''
  };

  propiedades: Propiedad[] = [];
  cargandoPropiedades = false;
  cargandoGuardar = false;
  errorPropiedad: string | null = null;
  mensajeOkPropiedad: string | null = null;

  // ------- SIMULACIÓN -------
  bancos: BancoOpcion[] = [
    { id: 1, nombre: 'BCP',             tea: 13.99, maxGracia: 0 },
    { id: 2, nombre: 'BBVA',            tea: 13.10, maxGracia: 0 },
    { id: 3, nombre: 'Interbank',       tea: 12.60, maxGracia: 6 },
    { id: 4, nombre: 'Scotiabank',      tea: 8.40,  maxGracia: 0 },
    { id: 5, nombre: 'BanBif',          tea: 13.00, maxGracia: 0 },
    { id: 6, nombre: 'Banco Pichincha', tea: 15.00, maxGracia: 0 },
    { id: 7, nombre: 'Bancom',          tea: 10.90, maxGracia: 0 },
    { id: 8, nombre: 'Banco GNB',       tea: 10.50, maxGracia: 0 },
    { id: 9, nombre: 'Banco Santander', tea: 18.50, maxGracia: 0 },
    { id: 10, nombre: 'CMAC Huancayo',  tea: 10.80, maxGracia: 6 },
    { id: 11, nombre: 'CMAC Ica',       tea: 14.00, maxGracia: 6 },
    { id: 12, nombre: 'CMAC Cusco',     tea: 12.68, maxGracia: 0 },
    { id: 13, nombre: 'CMAC Trujillo',  tea: 10.84, maxGracia: 6 },
    { id: 14, nombre: 'CMAC Maynas',    tea: 19.00, maxGracia: 6 },
    { id: 15, nombre: 'CMAC Arequipa',  tea: 14.95, maxGracia: 6 },
    { id: 16, nombre: 'CMAC Piura',     tea: 11.50, maxGracia: 6 }
  ];

  productos: ProductoCredito[] = [];
  cargandoProductos = false;

  simulacionModelo = {
  propiedadId: null as number | null,
  productoId: null as number | null,
  bancoId: null as number | null,
  periodoGracia: 0,
  montoSolicitado: 0,

  // Nuevos campos
  moneda: 'PEN',
  tipoTasa: 'EFECTIVA',
  tasaAnual: null as number | null,
  capitalizacionPorAnio: 12
};


  cargandoSimulacion = false;
  errorSimulacion: string | null = null;
  simulacionResumen: SimulacionHipoteca | null = null;
  cuotas: CuotaProgramada[] = [];

  constructor(
    private router: Router,
    private propiedadService: PropiedadService,
    private simulacionService: SimulacionService
  ) {
    const data = localStorage.getItem('usuario');
    this.usuario = data ? JSON.parse(data) : null;

    if (!this.usuario || !this.usuario.id) {
      this.router.navigate(['/login']);
    } else {
      this.cargarPropiedades();
      this.cargarProductos();
    }
  }

  // ======== GETTERS ÚTILES ========

  get bancoSeleccionado(): BancoOpcion | null {
    return this.bancos.find(b => b.id === this.simulacionModelo.bancoId) || null;
  }

  get propiedadSeleccionada(): Propiedad | null {
    return this.propiedades.find(p => p.id === this.simulacionModelo.propiedadId) || null;
  }

  // ======== VIVIENDAS ========

  cargarPropiedades() {
    this.cargandoPropiedades = true;
    this.errorPropiedad = null;

    this.propiedadService.listarPorUsuario(this.usuario.id)
      .subscribe({
        next: (resp) => {
          this.propiedades = resp;
          this.cargandoPropiedades = false;
        },
        error: () => {
          this.cargandoPropiedades = false;
          this.errorPropiedad = 'No se pudieron cargar las viviendas.';
        }
      });
  }

  guardarPropiedad(form: NgForm) {
    if (form.invalid) return;

    this.cargandoGuardar = true;
    this.errorPropiedad = null;
    this.mensajeOkPropiedad = null;

    this.propiedadService.crear(this.propiedadModelo, this.usuario.id)
      .subscribe({
        next: (nueva) => {
          this.cargandoGuardar = false;
          this.mensajeOkPropiedad = 'Vivienda registrada correctamente.';

          const propConValor = {
            ...nueva,
            valor: this.propiedadModelo.valor
          };

          this.propiedades.push(propConValor);

          form.resetForm({
            tipo: 'Departamento',
            valor: 0
          });
        },
        error: (err) => {
          this.cargandoGuardar = false;
          this.errorPropiedad = err.error || 'Error al registrar la vivienda.';
        }
      });
  }

  // ======== PRODUCTOS / SIMULACIÓN ========

  cargarProductos() {
    this.cargandoProductos = true;
    this.errorSimulacion = null;

    this.simulacionService.listarProductos()
      .subscribe({
        next: (resp) => {
          this.productos = resp;
          this.cargandoProductos = false;
        },
        error: () => {
          this.cargandoProductos = false;
          this.errorSimulacion = 'No se pudieron cargar los productos de crédito.';
        }
      });
  }

  crearSimulacion(form: NgForm) {
    if (form.invalid || !this.usuario?.id) return;

    this.cargandoSimulacion = true;
    this.errorSimulacion = null;
    this.simulacionResumen = null;
    this.cuotas = [];

    const req: SimulacionRequest = {
      usuarioId: this.usuario.id,
      propiedadId: this.simulacionModelo.propiedadId!,
      productoId: this.simulacionModelo.productoId!,
      bancoId: this.simulacionModelo.bancoId!,
      periodoGracia: this.simulacionModelo.periodoGracia,
      montoSolicitado: this.simulacionModelo.montoSolicitado,
      moneda: this.simulacionModelo.moneda,
      tipoTasa: this.simulacionModelo.tipoTasa,
      tasaAnual: this.simulacionModelo.tasaAnual,
      capitalizacionPorAnio: this.simulacionModelo.capitalizacionPorAnio
    };

    this.simulacionService.crearSimulacion(req)
      .subscribe({
        next: (sim) => {
          this.cargandoSimulacion = false;
          this.simulacionResumen = sim;
          this.cargarCuotas(sim.id);
        },
        error: (err) => {
          this.cargandoSimulacion = false;
          this.errorSimulacion = err.error || 'Error al crear la simulación.';
        }
      });
  }

  cargarCuotas(simulacionId: number) {
    this.simulacionService.obtenerCuotas(simulacionId)
      .subscribe({
        next: (lista) => {
          this.cuotas = lista;
        },
        error: () => {
          // Si falla, solo no mostramos cuotas
        }
      });
  }

  // ======== LOGOUT ========

  logout() {
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
}
