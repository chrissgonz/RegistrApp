import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class RegistroPage implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private storageService: StorageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group(
      {
        nombre: ['', Validators.required],
        usuario: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        role: ['', Validators.required], // Asegúrate de que este campo está incluido
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value || '';
    const confirmPassword = control.get('confirmPassword')?.value || '';
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      const { nombre, usuario, password, role } = this.registerForm.value;
  
      try {
        await this.storageService.addUser({ nombre, usuario, password, role });
        console.log('Usuario registrado correctamente:', { nombre, usuario, role });
        this.router.navigate(['/login']);
      } catch (error) {
        console.error('Error al registrar el usuario:', error);
      }
    } else {
      console.log('Formulario inválido');
    }
  }
}