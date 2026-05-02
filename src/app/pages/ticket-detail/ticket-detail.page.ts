import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonChip,
  IonButtons,
  IonBackButton,
  IonLabel,
  IonItem,
  AlertController
} from '@ionic/angular/standalone';
import { TicketService } from '../../services/ticket.service';
import { getAuth } from 'firebase/auth';
import { addIcons } from 'ionicons';
import { arrowBackOutline, chatbubbleOutline, checkmarkCircleOutline, timeOutline } from 'ionicons/icons';

interface Ticket {
  id?: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  createdAt: Date;
  userEmail: string;
  response?: string;
}

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.page.html',
  styleUrls: ['./ticket-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonChip,
    IonButtons,
    IonBackButton,
    IonLabel,
    IonItem
  ]
})
export class TicketDetailPage implements OnInit {
  ticket: Ticket | null = null;
  isLoading: boolean = true;
  ticketId: string = '';
  esAdmin: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private alertController: AlertController
  ) {
    addIcons({ arrowBackOutline, chatbubbleOutline, checkmarkCircleOutline, timeOutline });
  }

  async ngOnInit() {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    // Verificar si es admin
    const emailsAdmin = [
      'gloriarondon1234@gmail.com',
      'sergio.cuesta1234@gmail.com',
      'david.esteban@gmail.com'
    ];
    this.esAdmin = emailsAdmin.includes(user.email || '');

    this.ticketId = this.route.snapshot.paramMap.get('id') || '';
    console.log('Ticket ID:', this.ticketId);
    
    if (!this.ticketId) {
      this.showAlert('Error', 'ID de ticket no válido');
      this.router.navigate(['/dashboard']);
      return;
    }

    await this.loadTicket();
  }

  async loadTicket() {
    this.isLoading = true;
    
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    // Usar el método que obtiene tickets del usuario actual
    this.ticketService.getMyTickets((tickets: Ticket[]) => {
      const found = tickets.find(t => t.id === this.ticketId);
      if (found) {
        this.ticket = found;
        console.log('Ticket encontrado:', this.ticket);
      } else {
        console.log('Ticket no encontrado');
        this.ticket = null;
      }
      this.isLoading = false;
    });
  }

  getStatusColor(status: string): string {
    switch(status) {
      case 'abierto': return 'warning';
      case 'en_proceso': return 'primary';
      case 'resuelto': return 'success';
      case 'cerrado': return 'medium';
      default: return 'medium';
    }
  }

  getStatusText(status: string): string {
    const textos: Record<string, string> = {
      'abierto': 'Abierto',
      'en_proceso': 'En Proceso',
      'resuelto': 'Resuelto',
      'cerrado': 'Cerrado'
    };
    return textos[status] || status;
  }

  getPriorityColor(priority: string): string {
    switch(priority) {
      case 'urgente': return 'danger';
      case 'alta': return 'warning';
      case 'media': return 'primary';
      case 'baja': return 'success';
      default: return 'medium';
    }
  }

  getPriorityText(priority: string): string {
    const textos: Record<string, string> = {
      'urgente': 'Urgente',
      'alta': 'Alta',
      'media': 'Media',
      'baja': 'Baja'
    };
    return textos[priority] || priority;
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  volver() {
    this.router.navigate(['/dashboard']);
  }
}