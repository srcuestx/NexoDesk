import { Component } from '@angular/core';
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
  LoadingController,
  AlertController
} from '@ionic/angular/standalone';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, personAddOutline, arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
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
    IonCardContent
  ]
})
export class RegisterPage {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    addIcons({ mailOutline, lockClosedOutline, personAddOutline, arrowBackOutline });
  }

  async register() {
    if (!this.email || !this.password) {
      this.showAlert('Error', 'Completa todos los campos');
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.showAlert('Error', 'Las contraseñas no coinciden');
      return;
    }
    if (this.password.length < 6) {
      this.showAlert('Error', 'Mínimo 6 caracteres');
      return;
    }

    const loading = await this.loadingController.create({ message: 'Creando cuenta...' });
    await loading.present();

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
      
      const db = getDatabase();
      await set(ref(db, `users/${userCredential.user.uid}`), {
        email: this.email,
        role: 'user',
        createdAt: new Date().toISOString()
      });
      
      await loading.dismiss();
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Cuenta creada. Inicia sesión.',
        buttons: [{ text: 'OK', handler: () => this.router.navigate(['/login']) }]
      });
      await alert.present();
    } catch (error: any) {
      await loading.dismiss();
      let message = 'Error al crear la cuenta';
      if (error.code === 'auth/email-already-in-use') message = 'Email ya registrado';
      this.showAlert('Error', message);
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({ header, message, buttons: ['OK'] });
    await alert.present();
  }
}