import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importa FormsModule

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.page.html',
  styleUrls: ['./asistencia.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class AsistenciaPage implements OnInit {
  qrCode: string | null = null; // Último QR generado
  qrCodesList: { section: string; qrCode: string }[] = []; // Lista de códigos QR generados por sección
  sections: string[] = []; // Lista de secciones disponibles (vacía por defecto)
  selectedSection: string | null = null; // Sección seleccionada por el usuario
  role: string | null = null; // Variable que almacena el rol
  cursos: { codigo: string; horario: string; jornada: string }[] = []; // Lista de cursos
  selectedRole: string | null = null; // Rol seleccionado por el usuario

  constructor(private router: Router, private storageService: StorageService) {}


  async ngOnInit() {
    try {
      // Recuperar el rol del usuario desde el Storage
      const usuario = await this.storageService.getLoggedInUser();

      if (usuario?.role) {
        this.role = usuario.role; // Asignar el rol
        console.log('Rol recuperado:', this.role);

        // Validar si el rol es permitido
        if (this.role !== 'alumno' && this.role !== 'docente') {
          console.error('Rol no autorizado:', this.role);
          this.router.navigate(['login']); // Redirigir si el rol no es válido
          return;
        }
      } else {
        console.error('Rol no encontrado. Redirigiendo...');
        this.router.navigate(['login']); // Redirigir si no hay rol
        return;
      }

      // Recuperar cursos si el rol es válido
      this.cursos = (await this.storageService.getItem<any[]>('cursos')) || [];
      console.log('Cursos cargados:', this.cursos);
    } catch (error) {
      console.error('Error al inicializar la página de asistencia:', error);
      this.router.navigate(['login']); // Redirigir en caso de error
    }
  }
  

  // Función para cargar los cursos guardados en el almacenamiento
  async loadCursos() {
    try {
      const cursosGuardados = await this.storageService.getItem<{ codigo: string; horario: string; jornada: string }[]>('cursos') || [];
      this.cursos = cursosGuardados;
    } catch (error) {
      console.error('Error al cargar los cursos:', error);
    }
  }

  // Nueva función para redirigir a la página de crear QR
  async irACrearQr() {
    if (!this.selectedSection) {
      console.error('Debe seleccionar una sección antes de continuar.');
      return;
    }
    this.router.navigate(['crear-qr'], {
      queryParams: { section: this.selectedSection },
    });
  }

  async generateQrCode() {
    if (!this.selectedSection) {
      console.error('Debe seleccionar una sección antes de generar el código QR.');
      return;
    }

    // Generar un nuevo código QR con formato basado en la sección
    const newQrCode = `QR-${this.selectedSection}-${new Date().getTime()}`; // Ejemplo: QR-005V-<timestamp>
    this.qrCode = newQrCode;

    // Guardar el código QR en la lista local
    this.qrCodesList.push({ section: this.selectedSection, qrCode: newQrCode });

    // Guardar en almacenamiento persistente
    await this.storageService.setItem('generatedQRCodes', this.qrCodesList);

    // Redirigir a la página de creación de QR
    this.router.navigate(['crear-qr'], {
      queryParams: { section: this.selectedSection }, // Pasar la sección seleccionada como parámetro
    });
  }

  async showQrCode(qrCode: string) {
    // Mostrar un código QR específico en la interfaz
    this.qrCode = qrCode;
  }

  filterBySection(section: string) {
    // Filtrar la lista de códigos QR por sección
    return this.qrCodesList.filter((item) => item.section === section);
  }

  async agregarSeccion(nuevaSeccion: string) {
    // Verificar que la nueva sección no exista
    if (!this.sections.includes(nuevaSeccion)) {
      this.sections.push(nuevaSeccion);
      // Guardar la nueva sección en el almacenamiento
      await this.storageService.setItem('sections', this.sections);
    } else {
      console.error('La sección ya existe.');
    }
  }

  volver() {
    // Navegar a la página de inicio
    this.router.navigate(['home']);
  }

  Leerqr() {
    // Navegar a la página de lectura de QR
    this.router.navigate(['leer-qr']);
  }

  generarNuevoQrCode() {
    // Navegar a la página de creación de QR
    this.router.navigate(['crear-qr']);
  }

  crearCurso() {
    // Navegar a la página de creación de cursos
    this.router.navigate(['crear-curso']);
  }

  // Función para manejar la selección de un curso
  selectCourse(codigo: string) {
    console.log('Curso seleccionado:', codigo);
    // Aquí podrías agregar la lógica para filtrar o cargar datos específicos del curso seleccionado
  }
  
}

