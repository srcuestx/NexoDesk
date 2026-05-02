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
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonChip,
  IonButtons,
  IonMenuButton,
  IonRefresher,
  IonRefresherContent,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel
} from '@ionic/angular/standalone';
import { TicketService } from '../../services/ticket.service';
import { StatusService, ServiceStatus } from '../../services/status.service';
import { getAuth } from 'firebase/auth';
import { addIcons } from 'ionicons';
import { 
  addOutline, 
  ticketOutline, 
  refreshOutline, 
  serverOutline,
  informationCircleOutline,
  checkmarkCircleOutline,
  timeOutline,
  closeCircleOutline,
  constructOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
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
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonChip,
    IonButtons,
    IonMenuButton,
    IonRefresher,
    IonRefresherContent,
    IonGrid,
    IonRow,
    IonCol,
    IonLabel
  ]
})
export class DashboardPage implements OnInit, OnDestroy {
  tickets: any[] = [];
  stats = { total: 0, abiertos: 0, enProceso: 0, resueltos: 0 };
  isLoading: boolean = true;
  servicesStatus: ServiceStatus[] = [];
  private unsubscribe: any;

  constructor(
    private ticketService: TicketService,
    private statusService: StatusService,
    private router: Router
  ) {
    addIcons({ 
      addOutline, 
      ticketOutline, 
      refreshOutline, 
      serverOutline,
      informationCircleOutline,
      checkmarkCircleOutline,
      timeOutline,
      closeCircleOutline,
      constructOutline
    });
  }

  async ngOnInit() {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.loadTickets();
    this.loadServicesStatus();
  }

  loadTickets() {
    this.isLoading = true;
    this.unsubscribe = this.ticketService.getMyTickets((tickets: any[]) => {
      this.tickets = tickets;
      this.calculateStats();
      this.isLoading = false;
    });
  }

  loadServicesStatus() {
    this.statusService.getServicesStatus().subscribe(statuses => {
      this.servicesStatus = statuses;
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

  getServiceStatusColor(status: string): string {
    return this.statusService.getStatusColor(status);
  }

  getServiceStatusIcon(status: string): string {
    return this.statusService.getStatusIcon(status);
  }

  getServiceStatusText(status: string): string {
    return this.statusService.getStatusText(status);
  }

  goToTicketDetail(id: string) {
    this.router.navigate(['/ticket-detail', id]);
  }

  goToCreateTicket() {
    this.router.navigate(['/create-ticket']);
  }

  async doRefresh(event: any) {
    this.loadTickets();
    this.loadServicesStatus();
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