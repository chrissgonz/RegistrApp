import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { StorageService } from '../services/storage.service'; // Asegúrate de tener este servicio

@Component({
  selector: 'app-leer-qr',
  standalone: true,
  templateUrl: './leer-qr.page.html',
  styleUrls: ['./leer-qr.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class LeerQrPage implements OnInit, OnDestroy {
  scannerResult: string | null = null; // Resultado del escáner
  isCameraPermissionGranted = false; // Estado de permisos de cámara
  private qrScanner: Html5QrcodeScanner | null = null;
  qrCodesList: string[] = []; // Lista para almacenar los resultados escaneados

  constructor(private storageService: StorageService) {}

  ngOnInit() {
    // Cargar los QR escaneados previamente desde el almacenamiento local
    this.loadScannedQrCodes();
  }

  ngAfterViewInit() {
    this.startScanner();
  }
  

  requestCameraPermission() {
    if (navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          this.isCameraPermissionGranted = true;
          this.startScanner();
  
          // Detener el stream después de obtener permisos
          stream.getTracks().forEach(track => track.stop());
        })
        .catch((error) => {
          console.error('Error al acceder a la cámara:', error);
          if (error.name === 'NotAllowedError') {
            alert('Permiso denegado. Habilita los permisos de la cámara en tu navegador.');
          } else if (error.name === 'NotFoundError') {
            alert('No se encontró una cámara en tu dispositivo.');
          } else if (error.name === 'NotReadableError') {
            alert('La cámara está siendo usada por otra aplicación.');
          } else {
            alert('Error desconocido al acceder a la cámara.');
          }
        });
    } else {
      alert('Tu navegador no soporta acceso a la cámara.');
    }
  }
  
  

  startScanner() {
    this.qrScanner = new Html5QrcodeScanner(
      'reader', 
      { fps: 10, qrbox: 250, supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA] },
      false
    );

    this.qrScanner.render(
      (result) => {
        this.scannerResult = result;
        console.log('QR Escaneado:', result);

        // Detener el escáner después de un resultado
        if (this.qrScanner) {
          this.qrScanner.clear();
        }
      },
      (error) => {
        console.warn('Error al escanear QR:', error);
      }
    );
  }
  

  ngOnDestroy() {
    if (this.qrScanner) {
      this.qrScanner.clear();
    }
  
  }

  async saveScannedQrCode(result: string) {
    // Añadir el resultado escaneado a la lista
    this.qrCodesList.push(result);
    console.log('Códigos QR escaneados:', this.qrCodesList);

    // Guardar los datos en el almacenamiento local
    await this.storageService.setItem('scannedQrCodes', this.qrCodesList);
    this.loadScannedQrCodes(); // Actualizar el historial después de guardar el nuevo QR
  }

  async loadScannedQrCodes() {
    const qrData = await this.storageService.getItem<string[]>('scannedQrCodes');
    this.qrCodesList = qrData || [];
    console.log('Códigos QR cargados:', this.qrCodesList);
  }
}

