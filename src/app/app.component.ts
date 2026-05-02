import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { 
  IonApp, 
  IonSplitPane, 
  IonMenu, 
  IonHeader, 
  IonToolbar, 
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonFooter,
  IonMenuToggle,
  IonRouterOutlet
} from '@ionic/angular/standalone';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { addIcons } from 'ionicons';
import { 
  homeOutline, 
  addCircleOutline, 
  ticketOutline, 
  chatbubbleOutline, 
  cardOutline, 
  speedometerOutline, 
  listOutline, 
  logOutOutline,
  personCircleOutline
} from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonApp,
    IonSplitPane,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonFooter,
    IonMenuToggle,
    IonRouterOutlet
  ]
})
export class AppComponent implements OnInit {
  nombreUsuario: string = '';
  esAdmin: boolean = false;
  estaLogueado: boolean = false;

  private emailsAdmin = [
    'gloriarondon1234@gmail.com',
    'sergio.cuesta1234@gmail.com',
    'david.esteban@gmail.com'
  ];

  constructor(private router: Router) {
    addIcons({
      homeOutline,
      addCircleOutline,
      ticketOutline,
      chatbubbleOutline,
      cardOutline,
      speedometerOutline,
      listOutline,
      logOutOutline,
      personCircleOutline
    });
  }

  ngOnInit() {
    const auth = getAuth();
    
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.estaLogueado = true;
        this.nombreUsuario = user.email?.split('@')[0] || 'Usuario';
        this.esAdmin = this.emailsAdmin.includes(user.email || '');
      } else {
        this.estaLogueado = false;
        this.nombreUsuario = '';
        this.esAdmin = false;
      }
    });
  }

  irAPagina(ruta: string) {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.router.navigate([ruta]);
  }

  async logout() {
    const auth = getAuth();
    await signOut(auth);
    this.router.navigate(['/landing']);
  }
}