import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  IonList,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonItemDivider,
  AlertController,
  LoadingController
} from '@ionic/angular/standalone';
import { TicketService } from '../../services/ticket.service';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import { addIcons } from 'ionicons';
import { arrowBackOutline, chatbubbleOutline, checkmarkCircleOutline, timeOutline, personOutline, saveOutline } from 'ionicons/icons';

interface Ticket {
  id?: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  createdAt: Date;
  userEmail: string;
  userId?: string;
  response?: string;
  assignedTo?: string;
  assignedAt?: string;
  history?: Array<{
    action: string;
    by: string;
    to?: string;
    from?: string;
    at: string;
  }>;
}

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.page.html',
  styleUrls: ['./ticket-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
    IonList,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonItemDivider
  ]
})
export class TicketDetailPage implements OnInit {
  ticket: Ticket | null = null;
  isLoading: boolean = true;
  ticketId: string = '';
  userId: string = '';
  esAdmin: boolean = false;
  esTecnicoAsignado: boolean = false;
  newStatus: string = '';
  adminResponse: string = '';
  listaTecnicos: string[] = [];
  nuevoTecnico: string = '';
  currentUserEmail: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    addIcons({ arrowBackOutline, chatbubbleOutline, checkmarkCircleOutline, timeOutline, personOutline, saveOutline });
  }

  async ngOnInit() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    this.currentUserEmail = user.email || '';
    console.log('Usuario actual:', this.currentUserEmail);

    const emailsAdmin = [
      'gloriarondon1234@gmail.com',
      'sergio.cuesta1234@gmail.com',
      'david.esteban@gmail.com'
    ];
    this.esAdmin = emailsAdmin.includes(this.currentUserEmail);
    console.log('¿Es admin?', this.esAdmin);

    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    this.ticketId = this.route.snapshot.paramMap.get('id') || '';
    console.log('userId en ruta:', this.userId, 'ticketId:', this.ticketId);

    if (!this.ticketId) {
      this.showAlert('Error', 'ID de ticket no válido');
      this.router.navigate(['/dashboard']);
      return;
    }

    if (this.esAdmin) {
      await this.cargarListaTecnicos();
    }

    await this.loadTicket();
  }

  async cargarListaTecnicos() {
    const db = getDatabase();
    const systemRef = ref(db, 'system');
    const snapshot = await get(systemRef);
    const system = snapshot.val();
    this.listaTecnicos = system?.technicians || [];
    console.log('Lista técnicos:', this.listaTecnicos);
  }

  async loadTicket() {
    this.isLoading = true;
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    // CASO 1: Si tenemos userId en la ruta (admin o técnico)
    if (this.userId) {
      const found = await this.ticketService.getTicketById(this.userId, this.ticketId);
      this.ticket = found;
      if (this.ticket) {
        this.newStatus = this.ticket.status;
        this.nuevoTecnico = this.ticket.assignedTo || '';
        // Verificar si el usuario actual es el técnico asignado (puede ser admin o técnico)
        this.esTecnicoAsignado = (this.ticket.assignedTo === this.currentUserEmail);
        console.log('Ticket cargado por userId:', this.ticket.title);
        console.log('¿Es técnico asignado?', this.esTecnicoAsignado);
      } else {
        console.log('Ticket no encontrado con userId:', this.userId);
      }
    } 
    // CASO 2: Usuario normal (sin userId en ruta) – solo sus propios tickets
    else {
      this.ticketService.getMyTickets((tickets: Ticket[]) => {
        const found = tickets.find(t => t.id === this.ticketId);
        this.ticket = found || null;
        if (this.ticket) {
          this.newStatus = this.ticket.status;
          this.nuevoTecnico = this.ticket.assignedTo || '';
          this.esTecnicoAsignado = (this.ticket.assignedTo === this.currentUserEmail);
          // Si el usuario es admin pero no había userId, lo obtenemos del ticket
          if (this.esAdmin && !this.userId && this.ticket.userId) {
            this.userId = this.ticket.userId;
          }
        }
        this.isLoading = false;
      });
      return;
    }
    this.isLoading = false;
  }

  async cambiarTecnico() {
    if (!this.ticket || !this.esAdmin || !this.nuevoTecnico || this.nuevoTecnico === this.ticket.assignedTo) return;

    const confirm = await this.alertController.create({
      header: 'Reasignar ticket',
      message: `¿Asignar este ticket a ${this.nuevoTecnico}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { 
          text: 'Aceptar',
          handler: async () => {
            const loading = await this.loadingController.create({ message: 'Reasignando...' });
            await loading.present();
            try {
              const userId = this.ticket!.userId || this.userId;
              await this.ticketService.reassignTicket(this.ticket!.id!, userId, this.nuevoTecnico);
              await this.loadTicket();
              this.showAlert('Éxito', 'Técnico reasignado correctamente');
            } catch (error: any) {
              this.showAlert('Error', error.message);
            } finally {
              loading.dismiss();
            }
          }
        }
      ]
    });
    await confirm.present();
  }

  async updateTicket() {
    if (!this.ticket) return;
    // Solo admin o el técnico asignado pueden modificar
    if (!this.esAdmin && !this.esTecnicoAsignado) {
      this.showAlert('Permiso denegado', 'No tienes permisos para modificar este ticket');
      return;
    }

    const changes: any = {};
    let actionMessage = '';

    if (this.newStatus && this.newStatus !== this.ticket.status) {
      changes.status = this.newStatus;
      actionMessage = `Estado cambiado a ${this.newStatus}`;
    }

    if (this.adminResponse && this.adminResponse.trim()) {
      changes.response = this.adminResponse.trim();
      actionMessage = actionMessage ? `${actionMessage} y respuesta agregada` : 'Respuesta agregada';
    }

    if (Object.keys(changes).length === 0) {
      this.showAlert('Info', 'No hay cambios para guardar');
      return;
    }

    const loading = await this.loadingController.create({ message: 'Actualizando...' });
    await loading.present();

    try {
      const auth = getAuth();
      const actorEmail = auth.currentUser?.email || 'sistema';
      const userId = this.ticket.userId || this.userId;
      if (!userId) throw new Error('No se puede identificar al usuario del ticket');

      await this.ticketService.updateTicketAdmin(this.ticket.id!, userId, changes, actionMessage, actorEmail);

      await this.loadTicket();
      this.adminResponse = '';
      this.showAlert('Éxito', 'Ticket actualizado correctamente');
    } catch (error: any) {
      this.showAlert('Error', error.message);
    } finally {
      loading.dismiss();
    }
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
    const alert = await this.alertController.create({ header, message, buttons: ['OK'] });
    await alert.present();
  }

  volver() {
    this.router.navigate(['/dashboard']);
  }
}