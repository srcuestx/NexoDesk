import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  IonButtons,
  IonMenuButton,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonLabel,
  AlertController,
  LoadingController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cardOutline, cashOutline, alertCircleOutline } from 'ionicons/icons';

declare var paypal: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
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
    IonButtons,
    IonMenuButton,
    IonSelect,
    IonSelectOption,
    IonItem,
    IonLabel
  ]
})
export class PaymentPage implements AfterViewInit, OnDestroy {
  planes = [
    { nombre: 'Soporte Básico', precio: 10, descripcion: 'Respuesta en 24 horas' },
    { nombre: 'Soporte Prioritario', precio: 25, descripcion: 'Respuesta en 4 horas' },
    { nombre: 'Soporte Urgente', precio: 50, descripcion: 'Respuesta en 1 hora + prioridad máxima' }
  ];
  planSeleccionado = this.planes[2];
  pagoCompletado = false;
  private scriptLoaded: boolean = false;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    addIcons({ cardOutline, cashOutline, alertCircleOutline });
  }

  ngAfterViewInit() {
    this.cargarPayPal();
  }

  ngOnDestroy() {
    // Limpiar el contenedor del botón de PayPal al destruir la página
    const container = document.getElementById('paypal-button-container');
    if (container) {
      container.innerHTML = '';
    }
  }

  cargarPayPal() {
    if (this.scriptLoaded) {
      this.renderPayPalButton();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=test&currency=USD';
    script.onload = () => {
      this.scriptLoaded = true;
      this.renderPayPalButton();
    };
    document.body.appendChild(script);
  }

  renderPayPalButton() {
    const container = document.getElementById('paypal-button-container');
    if (!container) return;
    
    // Limpiar el contenedor antes de renderizar
    container.innerHTML = '';
    
    if (typeof paypal === 'undefined' || !paypal.Buttons) {
      console.error('PayPal no está disponible');
      return;
    }
    
    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: this.planSeleccionado.precio.toString()
            },
            description: this.planSeleccionado.nombre
          }]
        });
      },
      onApprove: async (data: any, actions: any) => {
        const order = await actions.order.capture();
        console.log('Pago exitoso:', order);
        this.pagoCompletado = true;
        
        const alert = await this.alertController.create({
          header: '¡Pago Exitoso!',
          message: `Gracias por adquirir ${this.planSeleccionado.nombre}. Tu soporte urgente ha sido activado.`,
          buttons: [{
            text: 'OK',
            handler: () => {
              this.router.navigate(['/create-ticket']);
            }
          }]
        });
        await alert.present();
      },
      onError: (err: any) => {
        console.error('Error en pago:', err);
        this.mostrarError('Error en el pago. Por favor intenta nuevamente.');
      }
    }).render('#paypal-button-container');
  }

  async mostrarError(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  cambiarPlan(plan: any) {
    this.planSeleccionado = plan;
    this.pagoCompletado = false;
    this.renderPayPalButton();
  }
}