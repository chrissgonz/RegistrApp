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

par_username:string="";


  constructor(private router:Router) {}

  ngOnInit()  {

    // Recepcion de parametros
    const navigation =this.router.getCurrentNavigation();

    if (navigation?.extras.queryParams) {
      this.par_username=navigation.extras.queryParams['username']

    }
    
  }

}
