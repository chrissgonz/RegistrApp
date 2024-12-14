import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { StorageService } from '../services/storage.service'; // Importar el servicio de almacenamiento

@Component({
  selector: 'app-r-clave',
  templateUrl: './r-clave.page.html',
  styleUrls: ['./r-clave.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class RClavePage {
  recoveryForm: FormGroup;
  showPassword: boolean = false; // Para alternar visibilidad de la contraseña
  successMessage: string = ''; // Mensaje de éxito
  errorMessage: string = ''; // Mensaje de error

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private storageService: StorageService // Inyectar el servicio
  ) {
    this.recoveryForm = this.formBuilder.group({
      username: ['', Validators.required],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(12),
          Validators.pattern('^[a-zA-Z0-9]*$'), // Solo letras y números
        ],
      ],
    });
  }

  async onSubmit() {
    if (this.recoveryForm.valid) {
      const { username, newPassword } = this.recoveryForm.value;

      try {
        const updated = await this.storageService.updatePassword(username, newPassword);

        if (updated) {
          this.successMessage = 'La contraseña se ha actualizado exitosamente.';
          this.errorMessage = '';

          // Redirigir al login después de 3 segundos
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 3000);
        } else {
          this.errorMessage = 'Error: Usuario no encontrado.';
          this.successMessage = '';
        }
      } catch (error) {
        this.errorMessage = 'Ocurrió un error al actualizar la contraseña.';
        console.error('Error al actualizar la contraseña:', error);
      }
    } else {
      console.log('Formulario inválido');
      this.errorMessage = 'Por favor completa todos los campos correctamente.';
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword; // Alterna entre mostrar/ocultar contraseña
  }

  volverLogin() {
    this.router.navigate(['login']);
  }
}