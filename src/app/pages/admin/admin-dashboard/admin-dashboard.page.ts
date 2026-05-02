import { Component, OnInit, OnDestroy } from '@angular/core';
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
  IonRefresher,
  IonRefresherContent,
  IonList,
  IonItem,
  IonLabel,
  AlertController
} from '@ionic/angular/standalone';
import { TicketService } from '../../../services/ticket.service';
import { getAuth } from 'firebase/auth';
import { addIcons } from 'ionicons';
import { refreshOutline, checkmarkCircleOutline, timeOutline, closeCircleOutline, peopleOutline } from 'ionicons/icons';

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
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
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
    IonRefresher,
    IonRefresherContent,
    IonList,
    IonItem,
    IonLabel
  ]
})
export class AdminDashboardPage implements OnInit, OnDestroy {
  tickets: Ticket[] = [];
  stats = { total: 0, abiertos: 0, enProceso: 0, resueltos: 0 };
  isLoading: boolean = true;
  private unsubscribe: any;

  constructor(
    private ticketService: TicketService,
    private router: Router,
    private alertController: AlertController
  ) {
    addIcons({ refreshOutline, checkmarkCircleOutline, timeOutline, closeCircleOutline, peopleOutline });
  }

  ngOnInit() {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadTickets();
  }

  loadTickets() {
    this.isLoading = true;
    this.unsubscribe = this.ticketService.getAllTickets((tickets: Ticket[]) => {
      this.tickets = tickets;
      this.calculateStats();
      this.isLoading = false;
      console.log('Admin - Tickets cargados:', tickets.length);
    });
  }

  calculateStats() {
    this.stats.total = this.tickets.length;
    this.stats.abiertos = this.tickets.filter(t => t.status === 'abierto').length;
    this.stats.enProceso = this.tickets.filter(t => t.status === 'en_proceso').length;
    this.stats.resueltos = this.tickets.filter(t => t.status === 'resuelto' || t.status === 'cerrado').length;
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

  async doRefresh(event: any) {
    this.loadTickets();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}