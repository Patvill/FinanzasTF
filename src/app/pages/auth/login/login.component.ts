import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../core/services/usuario.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  email = '';
  password = '';
  cargando = false;
  error: string | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  onLogin() {
    this.error = null;
    this.cargando = true;

    this.usuarioService.login({ email: this.email, password: this.password })
      .subscribe({
        next: (resp) => {
          // Guarda usuario en localStorage
          localStorage.setItem('usuario', JSON.stringify(resp));
          this.cargando = false;
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.cargando = false;
          this.error = err.error || 'Credenciales incorrectas';
        }
      });
  }

  irARegistro() {
    this.router.navigate(['/register']);
  }
}
