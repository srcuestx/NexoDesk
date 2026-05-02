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
  IonIcon,
  IonInput,
  IonButtons,
  IonMenuButton,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { sendOutline, chatbubbleOutline, happyOutline, trashOutline, refreshOutline } from 'ionicons/icons';

interface Mensaje {
  texto: string;
  esUsuario: boolean;
  fecha: Date;
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.page.html',
  styleUrls: ['./chatbot.page.scss'],
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
    IonInput,
    IonButtons,
    IonMenuButton,
    IonList,
    IonItem,
    IonAvatar,
    IonLabel
  ]
})
export class ChatbotPage {
  mensajes: Mensaje[] = [];
  nuevoMensaje: string = '';
  isLoading: boolean = false;

  // Base de conocimientos del chatbot
  private respuestas: { [key: string]: string } = {
    'hola': '¡Hola! Soy el asistente virtual de Nexo Desk. ¿En qué puedo ayudarte?',
    'computador lento': 'Para mejorar el rendimiento de tu computador: 1) Cierra programas no utilizados, 2) Limpia archivos temporales, 3) Reinicia el equipo, 4) Verifica actualizaciones. ¿Necesitas crear un ticket para soporte?',
    'internet no funciona': 'Problemas de conexión: 1) Verifica que el WiFi esté activado, 2) Reinicia el router, 3) Olvida la red y vuelve a conectarte, 4) Contacta a tu proveedor de internet. ¿Deseas crear un ticket?',
    'no enciende pc': 'Si tu PC no enciende: 1) Verifica la conexión a corriente, 2) Prueba otro enchufe, 3) Revisa el cable de poder, 4) Mantén presionado el botón de encendido 10 segundos.',
    'mouse no funciona': 'Para el mouse: 1) Conecta/desconecta el USB, 2) Cambia las pilas (si es inalámbrico), 3) Prueba en otro puerto, 4) Actualiza drivers.',
    'impresora no imprime': 'Solución: 1) Verifica que esté encendida y con papel, 2) Revisa los niveles de tinta, 3) Reinicia la impresora, 4) Cancela todos los documentos en cola.',
    'virus': 'Si sospechas de un virus: 1) Ejecuta Windows Defender, 2) No abras archivos sospechosos, 3) Actualiza el antivirus, 4) Considera restaurar el sistema.',
    'contraseña olvidada': 'Para restablecer tu contraseña: 1) Ve a la pantalla de login, 2) Haz clic en "¿Olvidaste tu contraseña?", 3) Recibirás un email para restablecerla.',
    'crear ticket': '¡Claro! Para crear un ticket, ve al menú y selecciona "Crear Ticket". Describe tu problema y te ayudaremos lo antes posible.',
    'gracias': '¡De nada! Estoy aquí para ayudarte. ¿Necesitas algo más?',
    'adios': '¡Hasta luego! Si necesitas ayuda, aquí estoy.',
    'que puedes hacer': 'Puedo ayudarte con: problemas de PC lento, internet, mouse, impresora, virus, contraseñas y más. También puedo ayudarte a crear tickets de soporte.',
    'soporte urgente': 'Para soporte urgente, ve al menú y selecciona "Soporte Urgente". Podrás pagar con PayPal y tendrás atención prioritaria.',
    'estado ticket': 'Puedes ver el estado de tus tickets en el Dashboard. Cada ticket tiene un estado: Abierto, En Proceso, Resuelto o Cerrado.'
  };

  constructor(private router: Router) {
    addIcons({ sendOutline, chatbubbleOutline, happyOutline, trashOutline, refreshOutline });
    
    this.mensajes.push({
      texto: '¡Bienvenido a Nexo Desk! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy? Puedo resolver dudas sobre problemas técnicos o ayudarte a crear un ticket.',
      esUsuario: false,
      fecha: new Date()
    });
  }

  enviarMensaje() {
    if (!this.nuevoMensaje.trim()) return;

    this.mensajes.push({
      texto: this.nuevoMensaje,
      esUsuario: true,
      fecha: new Date()
    });

    const pregunta = this.nuevoMensaje.toLowerCase();
    this.nuevoMensaje = '';
    this.isLoading = true;

    setTimeout(() => {
      this.generarRespuesta(pregunta);
      this.isLoading = false;
    }, 500);
  }

  generarRespuesta(pregunta: string) {
    let respuesta = 'Lo siento, no entendí tu pregunta. ¿Podrías reformularla? Puedo ayudarte con problemas de: computador lento, internet, mouse, impresora, virus, contraseñas, o crear tickets.';

    for (const [key, value] of Object.entries(this.respuestas)) {
      if (pregunta.includes(key)) {
        respuesta = value;
        break;
      }
    }

    if (pregunta.includes('ticket') || (pregunta.includes('crear') && pregunta.includes('problema'))) {
      respuesta += ' ¿Te ayudo a crear un ticket ahora mismo?';
    }

    this.mensajes.push({
      texto: respuesta,
      esUsuario: false,
      fecha: new Date()
    });
  }

  crearTicket() {
    this.router.navigate(['/create-ticket']);
  }

  limpiarChat() {
    this.mensajes = [{
      texto: '¡Bienvenido a Nexo Desk! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy? Puedo resolver dudas sobre problemas técnicos o ayudarte a crear un ticket.',
      esUsuario: false,
      fecha: new Date()
    }];
  }
}