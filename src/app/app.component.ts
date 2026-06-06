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
import { getDatabase, ref, get } from 'firebase/database';
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
  personCircleOutline,
  constructOutline   // 👈 NUEVO: para el ícono del técnico
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
  esTecnico: boolean = false;   // 👈 NUEVO
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
      personCircleOutline,
      constructOutline   // 👈 NUEVO
    });
  }

  ngOnInit() {
    const auth = getAuth();
    
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.estaLogueado = true;
        this.nombreUsuario = user.email?.split('@')[0] || 'Usuario';
        this.esAdmin = this.emailsAdmin.includes(user.email || '');

        // 👇 Verificar si el usuario es técnico (está en system/technicians)
        const db = getDatabase();
        const systemRef = ref(db, 'system');
        const snapshot = await get(systemRef);
        const system = snapshot.val();
        const technicians = system?.technicians || [];
        this.esTecnico = technicians.includes(user.email || '') && !this.esAdmin;
        
      } else {
        this.estaLogueado = false;
        this.nombreUsuario = '';
        this.esAdmin = false;
        this.esTecnico = false;
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