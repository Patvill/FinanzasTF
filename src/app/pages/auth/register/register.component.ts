import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService, UsuarioRegistro } from '../../../core/services/usuario.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  modelo: UsuarioRegistro = {
    nombres: '',
    apellidos: '',
    email: '',
    password: '',
    tipoDocumento: 'DNI',
    numeroDocumento: '',
    telefono: '',
    ingresoMensual: 0,
    situacionLaboral: '',
    edad: 18,
    estadoCivil: 'Soltero'
  };

  cargando = false;
  error: string | null = null;
  mensajeOk: string | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    this.error = null;
    this.mensajeOk = null;
    this.cargando = true;

    this.usuarioService.registrar(this.modelo)
      .subscribe({
        next: () => {
          this.cargando = false;
          this.mensajeOk = 'Usuario registrado correctamente. Ahora puedes iniciar sesión.';
          setTimeout(() => this.router.navigate(['/login']), 1500);
        },
        error: (err) => {
          this.cargando = false;
          this.error = err.error || 'Error al registrar usuario';
        }
      });
  }

  volverLogin() {
    this.router.navigate(['/login']);
  }
}
