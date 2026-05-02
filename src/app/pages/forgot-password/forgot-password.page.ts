import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonInput,
  IonButton,
  IonItem,
  IonIcon,
  IonCard,
  IonCardContent,
  IonBackButton,
  IonButtons,
  AlertController,
  LoadingController
} from '@ionic/angular/standalone';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { addIcons } from 'ionicons';
import { lockOpenOutline, mailOutline, sendOutline } from 'ionicons/icons';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonInput,
    IonButton,
    IonItem,
    IonIcon,
    IonCard,
    IonCardContent,
    IonBackButton,
    IonButtons
  ]
})
export class ForgotPasswordPage {
  email: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    addIcons({ lockOpenOutline, mailOutline, sendOutline });
  }

  async resetPassword() {
    if (!this.email) {
      this.showAlert('Error', 'Por favor ingresa tu correo electrónico');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Enviando correo...'
    });
    await loading.present();

    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, this.email);
      
      await loading.dismiss();
      
      const alert = await this.alertController.create({
        header: 'Correo Enviado',
        message: `Se ha enviado un enlace de recuperación a ${this.email}. Revisa tu bandeja de entrada.`,
        buttons: [{
          text: 'OK',
          handler: () => {
            this.router.navigate(['/login']);
          }
        }]
      });
      await alert.present();
      
    } catch (error: any) {
      await loading.dismiss();
      
      let message = 'Error al enviar el correo';
      if (error.code === 'auth/user-not-found') {
        message = 'No existe una cuenta con este correo electrónico';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Correo electrónico inválido';
      }
      
      this.showAlert('Error', message);
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}