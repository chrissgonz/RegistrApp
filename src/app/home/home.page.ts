import { Component, OnInit } from '@angular/core';
//import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';

import { IonicModule } from '@ionic/angular';

import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule,FormsModule],
})
export class HomePage implements OnInit {

  nombre:string=""
  edad=""
  carrera:any='analista'

// Variables para leer parametros

par_username:string="";
par_password:number=0;


  constructor(private router:Router) {}

  ngOnInit()  {

    // Recepcion de parametros
    const navigation =this.router.getCurrentNavigation();

    if (navigation?.extras.queryParams) {
      this.par_username=navigation.extras.queryParams['username']
      this.par_password=navigation.extras.queryParams['password']

    }
    
  }
  asistencia(){
    this.router.navigate(['asistencia']);
  }


}
