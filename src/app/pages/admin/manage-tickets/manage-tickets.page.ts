import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
  IonMenuButton,
  IonList,
  IonItem,
  IonLabel,
  AlertController
} from '@ionic/angular/standalone';
import { TicketService } from '../../../services/ticket.service';
import { addIcons } from 'ionicons';
import { refreshOutline, checkmarkCircleOutline, timeOutline, closeCircleOutline } from 'ionicons/icons';

interface Ticket {
  id?: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  createdAt: Date;
  userEmail: string;
}

@Component({
  selector: 'app-manage-tickets',
  templateUrl: './manage-tickets.page.html',
  styleUrls: ['./manage-tickets.page.scss'],
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
    IonMenuButton,
    IonList,
    IonItem,
    IonLabel
  ]
})
export class ManageTicketsPage implements OnInit {
  tickets: Ticket[] = [];
  isLoading: boolean = true;
  private unsubscribe: any;

  constructor(
    private ticketService: TicketService,
    private router: Router,
    private alertController: AlertController
  ) {
    addIcons({ refreshOutline, checkmarkCircleOutline, timeOutline, closeCircleOutline });
  }

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    this.isLoading = true;
    this.unsubscribe = this.ticketService.getAllTickets((tickets: Ticket[]) => {
      this.tickets = tickets;
      this.isLoading = false;
      console.log('Tickets cargados:', tickets.length);
    });
  }

  getStatusColor(status: string): string {
    switch(status) {
      case 'abierto': return 'warning';
      case 'en_proceso': return 'primary';
      case 'resuelto': return 'success';
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
      default: return 'success';
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

  async cambiarEstado(ticket: Ticket, nuevoEstado: string) {
    const alert = await this.alertController.create({
      header: 'Cambiar Estado',
      message: `¿Cambiar "${ticket.title}" a ${this.getStatusText(nuevoEstado)}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { 
          text: 'Aceptar', 
          handler: async () => {
            if (ticket.id) {
              await this.ticketService.updateTicketStatus(ticket.id, nuevoEstado);
              this.loadTickets();
            }
          }
        }
      ]
    });
    await alert.present();
  }

  doRefresh(event: any) {
    this.loadTickets();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  volver() {
    this.router.navigate(['/dashboard']);
  }

  ngOnDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}