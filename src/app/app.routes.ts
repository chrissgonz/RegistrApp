import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'r-clave',
    loadComponent: () => import('./r-clave/r-clave.page').then( m => m.RClavePage)
  },
  {
    path: 'crear-qr',
    loadComponent: () => import('./crear-qr/crear-qr.page').then( m => m.CrearQrPage)
  },
  {
    path: 'leer-qr',
    loadComponent: () => import('./leer-qr/leer-qr.page').then( m => m.LeerQrPage)
  },
  {
    path: 'asistencia',
    loadComponent: () => import('./asistencia/asistencia.page').then( m => m.AsistenciaPage)
  },
  {
    path: 'registro',
    loadComponent: () => import('./registro/registro.page').then( m => m.RegistroPage)
  },
  {
    path: 'crear-curso',
    loadComponent: () => import('./crear-curso/crear-curso.page').then( m => m.CrearCursoPage)
  },
];
