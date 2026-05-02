import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { 
  IonContent, 
  IonHeader,
  IonToolbar,
  IonTitle,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  LoadingController,
  AlertController
} from '@ionic/angular/standalone';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, logInOutline, personAddOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonInput,
    IonButton,
    IonItem,
    IonLabel,
    IonIcon,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle
  ]
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    addIcons({ mailOutline, lockClosedOutline, logInOutline, personAddOutline });
  }

  ngOnInit() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  async login() {
    if (!this.email || !this.password) {
      this.showAlert('Error', 'Ingresa email y contraseña');
      return;
    }

    const loading = await this.loadingController.create({ message: 'Iniciando sesión...' });
    await loading.present();

    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, this.email, this.password);
      await loading.dismiss();
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      await loading.dismiss();
      let message = 'Error al iniciar sesión';
      if (error.code === 'auth/user-not-found') message = 'Usuario no encontrado';
      else if (error.code === 'auth/wrong-password') message = 'Contraseña incorrecta';
      this.showAlert('Error', message);
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({ header, message, buttons: ['OK'] });
    await alert.present();
  }
}