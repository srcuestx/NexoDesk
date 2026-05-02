import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonCard,
  IonCardContent,
  AlertController,
  LoadingController
} from '@ionic/angular/standalone';
import { getDatabase, ref, set, get } from 'firebase/database';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-setup-admin',
  templateUrl: './setup-admin.page.html',
  styleUrls: ['./setup-admin.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonCard,
    IonCardContent
  ]
})
export class SetupAdminPage {
  email: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  async agregarAdmin() {
    if (!this.email) {
      this.showAlert('Error', 'Ingresa un email');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Agregando administrador...'
    });
    await loading.present();

    try {
      const db = getDatabase();
      const emailKey = this.email.replace(/\./g, ',');
      const adminRef = ref(db, `admins/${emailKey}`);
      
      await set(adminRef, true);
      
      await loading.dismiss();
      
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: `✅ ${this.email} ahora es ADMINISTRADOR`,
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
      this.showAlert('Error', error.message);
    }
  }

  async agregarMultiplesAdmins() {
    const admins = [
      'gloriarondon1234@gmail.com',
      'sergio.cuesta1234@gmail.com',
      'david.esteban@gmail.com'
    ];

    const loading = await this.loadingController.create({
      message: 'Agregando administradores...'
    });
    await loading.present();

    try {
      const db = getDatabase();
      
      for (const email of admins) {
        const emailKey = email.replace(/\./g, ',');
        const adminRef = ref(db, `admins/${emailKey}`);
        await set(adminRef, true);
        console.log(`✅ ${email} agregado como admin`);
      }
      
      await loading.dismiss();
      
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: `✅ Se agregaron ${admins.length} administradores:\n- gloriarondon1234@gmail.com\n- sergio.cuesta1234@gmail.com\n- david.esteban@gmail.com`,
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
      this.showAlert('Error', error.message);
    }
  }

  async verificarAdmins() {
    const db = getDatabase();
    const adminsRef = ref(db, 'admins');
    const snapshot = await get(adminsRef);
    
    if (snapshot.exists()) {
      const admins = snapshot.val();
      const lista = Object.keys(admins).map(key => key.replace(/,/g, '.'));
      this.showAlert('Administradores actuales', lista.join('\n') || 'Ninguno');
    } else {
      this.showAlert('Administradores', 'No hay administradores registrados');
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