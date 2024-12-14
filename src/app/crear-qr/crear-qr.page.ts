import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { QRCodeModule } from 'angularx-qrcode';
import { ActivatedRoute, Router } from '@angular/router'; // Importamos ActivatedRoute
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-crear-qr',
  templateUrl: './crear-qr.page.html',
  styleUrls: ['./crear-qr.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, QRCodeModule],
})
export class CrearQrPage implements OnInit {
  qrData: string = 'Asistencia Registrada';
  createdCode: string = '';
  creationDateTime: string = ''; // Fecha y hora de generación
  lastGeneratedQr: string | null = null; // Último código QR guardado
  qrList: { section: string; code: string }[] = []; // Lista de códigos QR generados por sección
  selectedSection: string | null = null; // Sección seleccionada

  constructor(
    private router: Router,
    private route: ActivatedRoute, // Inyectamos ActivatedRoute
    private storageService: StorageService
  ) {}

  async ngOnInit() {
    // Recuperar el parámetro de sección desde la URL
    this.selectedSection = this.route.snapshot.queryParamMap.get('section');
    console.log('Sección seleccionada:', this.selectedSection);

    // Recuperar el último QR generado al cargar la página
    const qrData = await this.storageService.getItem<{ section: string; code: string }[]>('qrList');
    this.qrList = qrData || [];
  }

  async generateQrCodeForSection() {
    if (!this.selectedSection) {
      console.error('No se ha seleccionado una sección.');
      return;
    }

    // Obtener la fecha y hora actuales
    const now = new Date();
    this.creationDateTime = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;

    // Generar el código QR para la sección
    this.createdCode = `QR-${this.selectedSection}-${now.getTime()} - Generado el: ${this.creationDateTime}`;

    // Agregar el nuevo QR al principio de la lista
    this.qrList.unshift({ section: this.selectedSection, code: this.createdCode });

    // Guardar en almacenamiento persistente
    await this.storageService.setItem('qrList', this.qrList);

    // Actualizar el último QR guardado
    this.lastGeneratedQr = this.createdCode;

    console.log('Código QR generado:', this.createdCode);
  }

  // Método para desplegar el QR seleccionado
  desplegarQr(qr: string) {
    this.lastGeneratedQr = qr;
  
    // Guardar el último QR mostrado en el almacenamiento local (opcional)
    this.storageService.setItem('lastGeneratedQr', qr);
  }
  volver() {
    this.router.navigate(['asistencia']);
  }
}