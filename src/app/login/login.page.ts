import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service'; // Servicio de almacenamiento

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class LoginPage {
  loginForm!: FormGroup;
  showPassword: boolean = false; // Estado para mostrar/ocultar contraseña

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private storageService: StorageService
  ) {
    // Inicializar el formulario con validaciones
    this.loginForm = this.fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@duoc\\.cl$'), // Validación para correos @duoc.cl
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(12),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      role: ['', Validators.required], // Validación para seleccionar un rol
    });
  }

  //12/12/2024
  async onLogin() {
    if (this.loginForm.valid) {
      const username = this.loginForm.get('username')?.value.trim();
      const password = this.loginForm.get('password')?.value;
      const selectedRole = this.loginForm.get('role')?.value; // Obtener rol seleccionado
  
      try {
        // Validar las credenciales del usuario
        const usuarioValidado = await this.storageService.validateUser(username, password);
  
        if (usuarioValidado) {
          // Comparar el rol seleccionado con el rol del usuario en el almacenamiento
          if (usuarioValidado.role === selectedRole) {
            // Guarda el usuario en el almacenamiento
            await this.storageService.saveLoggedInUser({
              usuario: usuarioValidado.usuario,
              role: usuarioValidado.role,
            });
  
            console.log(`Inicio de sesión exitoso como ${usuarioValidado.role}`);
  
            // Redirigir a la página de asistencia
            this.router.navigate(['asistencia']);
          } else {
            console.error('El rol seleccionado no coincide con el rol del usuario.');
            alert('El rol seleccionado no coincide con el rol del usuario registrado.');
          }
        } else {
          console.error('Credenciales incorrectas');
          alert('Usuario o contraseña incorrectos.');
        }
      } catch (error) {
        console.error('Error durante la validación del usuario:', error);
      }
    } else {
      console.log('Formulario inválido');
      alert('Por favor, completa el formulario correctamente.');
    }
  }
  
  

  togglePassword() {
    this.showPassword = !this.showPassword; // Cambia el estado del campo de contraseña
  }

  registrarse() {
    this.router.navigate(['registro']);
  }

  recuperarClave() {
    this.router.navigate(['r-clave']);
  }
}
