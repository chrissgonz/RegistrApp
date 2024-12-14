import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }
  validaServicio(usuario:string , clave:number):boolean{
    // utilizaremos login=admin y password=1234
    
    if(usuario=='admin' && clave==1234){
      return true;
    }else {
      return false;
    }
    
    
    } // fin de validaServicio
    
}
