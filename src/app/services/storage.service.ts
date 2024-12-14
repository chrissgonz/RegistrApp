import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private qrCodeKey = 'lastCreatedQRCode';
  private qrListKey = 'qrList';
  private usersKey = 'usuariosRegistrados';
  private loggedInUserKey = 'loggedInUser';
  private sectionsKey = 'sections'; // Nueva clave para las secciones de cursos
  private coursesKey = 'cursos'; // Nueva clave para los cursos

  constructor() {}

  // Métodos generales de almacenamiento
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      console.log(`Datos guardados en la clave "${key}"`);
    } catch (error) {
      console.error(`Error guardando datos en la clave "${key}":`, error);
    }
  }

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error obteniendo datos de la clave "${key}":`, error);
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      localStorage.removeItem(key);
      console.log(`Clave "${key}" eliminada`);
    } catch (error) {
      console.error(`Error eliminando la clave "${key}":`, error);
    }
  }

  async clear(): Promise<void> {
    try {
      localStorage.clear();
      console.log('Almacenamiento local limpiado');
    } catch (error) {
      console.error('Error limpiando el almacenamiento local:', error);
    }
  }

  // Métodos específicos de QR
  async saveQrCode(qrCode: string): Promise<void> {
    try {
      const qrList = (await this.getItem<string[]>(this.qrListKey)) || [];
      qrList.push(qrCode);
      await this.setItem(this.qrListKey, qrList);
      console.log('QR code guardado correctamente');
    } catch (error) {
      console.error('Error guardando el código QR:', error);
    }
  }

  async getQrList(): Promise<string[]> {
    try {
      return (await this.getItem<string[]>(this.qrListKey)) || [];
    } catch (error) {
      console.error('Error obteniendo la lista de códigos QR:', error);
      return [];
    }
  }

  async getLastQrCode(): Promise<string | null> {
    try {
      const qrList = (await this.getItem<string[]>(this.qrListKey)) || [];
      return qrList.length > 0 ? qrList[qrList.length - 1] : null;
    } catch (error) {
      console.error('Error obteniendo el último código QR:', error);
      return null;
    }
  }

  // Métodos específicos de usuarios
  async addUser(user: { nombre: string; usuario: string; password: string; role: string }): Promise<void> {
    try {
      if (!user.nombre || !user.usuario || !user.password || !user.role) {
        console.error('El usuario debe tener los campos "nombre", "usuario", "password" y "role"');
        return;
      }
  
      const users = (await this.getItem<any[]>(this.usersKey)) || [];
      users.push(user);
      await this.setItem(this.usersKey, users);
      console.log('Usuario agregado correctamente:', user);
    } catch (error) {
      console.error('Error al agregar usuario:', error);
    }
  }

  async validateUser(username: string, password: string): Promise<any | null> {
    try {
      const usuarios = (await this.getItem<any[]>(this.usersKey)) || [];
      const usuario = usuarios.find(
        (user) =>
          user.usuario.toLowerCase() === username.toLowerCase() &&
          user.password === password
      );

      if (usuario) {
        console.log('Usuario validado correctamente:', usuario);
        return usuario;
      } else {
        console.warn('Credenciales incorrectas para el usuario:', username);
        return null;
      }
    } catch (error) {
      console.error('Error validando usuario:', error);
      return null;
    }
  }

  async updatePassword(username: string, newPassword: string): Promise<boolean> {
    try {
      const usuarios = (await this.getItem<any[]>(this.usersKey)) || [];
      const usuario = usuarios.find(
        (user) => user.usuario.toLowerCase() === username.toLowerCase()
      );

      if (usuario) {
        usuario.password = newPassword;
        await this.setItem(this.usersKey, usuarios);
        console.log(`Contraseña actualizada para el usuario: ${username}`);
        return true;
      } else {
        console.warn(`Usuario no encontrado: ${username}`);
        return false;
      }
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      return false;
    }
  }

  async saveLoggedInUser(user: { usuario: string; role: string }): Promise<void> {
    try {
      await this.setItem(this.loggedInUserKey, user);
      console.log('Usuario logueado guardado correctamente:', user);
    } catch (error) {
      console.error('Error al guardar el usuario logueado:', error);
    }
  }

  async getLoggedInUser(): Promise<any | null> {
    try {
      const user = await this.getItem<any>(this.loggedInUserKey);
      console.log('Usuario recuperado desde el almacenamiento:', user); // Depuración
      return user || null;
    } catch (error) {
      console.error('Error obteniendo el usuario logueado:', error);
      return null;
    }
  }

  // Métodos específicos de secciones
  async addSection(newSection: string): Promise<void> {
    try {
      const sections = (await this.getItem<string[]>(this.sectionsKey)) || [];
      if (!sections.includes(newSection)) {
        sections.push(newSection);
        await this.setItem(this.sectionsKey, sections);
        console.log('Sección agregada correctamente:', newSection);
      } else {
        console.warn('La sección ya existe:', newSection);
      }
    } catch (error) {
      console.error('Error al agregar la sección:', error);
    }
  }

  async getSections(): Promise<string[]> {
    try {
      return (await this.getItem<string[]>(this.sectionsKey)) || [];
    } catch (error) {
      console.error('Error obteniendo las secciones:', error);
      return [];
    }
  }

  // Métodos específicos de cursos
  async addCourse(course: { codigo: string; horario: string; jornada: string }): Promise<void> {
    try {
      const courses = (await this.getItem<any[]>(this.coursesKey)) || [];
      courses.push(course);
      await this.setItem(this.coursesKey, courses);
      console.log('Curso agregado correctamente:', course);
    } catch (error) {
      console.error('Error al agregar curso:', error);
    }
  }

  async getCourses(): Promise<any[]> {
    try {
      return (await this.getItem<any[]>(this.coursesKey)) || [];
    } catch (error) {
      console.error('Error obteniendo los cursos:', error);
      return [];
    }
  }
}
