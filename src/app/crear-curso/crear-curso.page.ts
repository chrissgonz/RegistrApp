import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importa FormsModule

@Component({
  selector: 'app-crear-curso',
  templateUrl: './crear-curso.page.html',
  styleUrls: ['./crear-curso.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class CrearCursoPage implements OnInit {

  codigoAsignatura: string = '';  // Variable para el código de asignatura
  horario: string = '';           // Variable para el horario
  jornada: string = '';           // Variable para la jornada (diurna o vespertina)

  constructor(private storageService: StorageService, private router: Router) { }

  ngOnInit() {
  }

  // Función para agregar el curso
  async agregarCurso() {
    if (this.codigoAsignatura && this.horario && this.jornada) {
      // Crear el objeto del curso
      const nuevoCurso = {
        codigo: this.codigoAsignatura,
        horario: this.horario,
        jornada: this.jornada
      };

      try {
        // Obtener la lista de cursos actuales desde el almacenamiento
        let cursos: { codigo: string; horario: string; jornada: string }[] = await this.storageService.getItem('cursos') || [];

        // Si la lista de cursos es null o no existe, inicializamos un array vacío
        if (!Array.isArray(cursos)) {
          cursos = [];  // Asegurarse de que siempre sea un array
        }

        // Agregar el nuevo curso a la lista
        cursos.push(nuevoCurso);

        // Guardar la lista de cursos actualizada en el almacenamiento
        await this.storageService.setItem('cursos', cursos);

        // Redirigir a la página de asistencia para mostrar el curso
        this.router.navigate(['/asistencia']);
      } catch (error) {
        console.error('Error al agregar el curso:', error);
        alert('Hubo un error al guardar el curso. Intente nuevamente.');
      }
    } else {
      alert('Por favor, complete todos los campos.');
    }
  }
}
