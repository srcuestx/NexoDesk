import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonInput,
  IonTextarea,
  IonButton,
  IonItem,
  IonLabel,
  IonIcon,
  IonCard,
  IonCardContent,
  IonSelect,
  IonSelectOption,
  IonButtons,
  IonMenuButton,
  LoadingController,
  AlertController
} from '@ionic/angular/standalone';
import { TicketService } from '../../services/ticket.service';
import { getAuth } from 'firebase/auth';
import { addIcons } from 'ionicons';
import { saveOutline } from 'ionicons/icons';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.page.html',
  styleUrls: ['./create-ticket.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonInput,
    IonTextarea,
    IonButton,
    IonItem,
    IonLabel,
    IonIcon,
    IonCard,
    IonCardContent,
    IonSelect,
    IonSelectOption,
    IonButtons,
    IonMenuButton
  ]
})
export class CreateTicketPage implements OnInit {
  title: string = '';
  description: string = '';
  priority: string = 'media';

  constructor(
    private ticketService: TicketService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    addIcons({ saveOutline });
  }

  async ngOnInit() {
    const auth = getAuth();
    const user = auth.currentUser;
    
    console.log('CreateTicket - Usuario:', user?.email);
    
    if (!user) {
      console.log('No hay usuario, redirigiendo a login');
      this.router.navigate(['/login']);
    }
  }

  async createTicket() {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      this.showAlert('Error', 'Debes iniciar sesión');
      this.router.navigate(['/login']);
      return;
    }
    
    if (!this.title.trim()) {
      this.showAlert('Error', 'Ingresa un título');
      return;
    }
    
    if (!this.description.trim()) {
      this.showAlert('Error', 'Ingresa una descripción');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Creando ticket...'
    });
    await loading.present();

    try {
      await this.ticketService.createTicket({
        title: this.title.trim(),
        description: this.description.trim(),
        priority: this.priority
      });
      
      await loading.dismiss();
      
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Ticket creado',
        buttons: [{
          text: 'OK',
          handler: () => this.router.navigate(['/dashboard'])
        }]
      });
      await alert.present();
      
    } catch (error: any) {
      await loading.dismiss();
      this.showAlert('Error', error.message);
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