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
import { sendOutline, chatbubbleOutline, trashOutline, refreshOutline } from 'ionicons/icons';
import { AiService } from '../../services/ai.service';

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

  constructor(
    private router: Router,
    private aiService: AiService
  ) {
    addIcons({ sendOutline, chatbubbleOutline, trashOutline, refreshOutline });
    this.mensajes.push({
      texto: '¡Hola! Soy el asistente de Nexo Desk, potenciado con inteligencia artificial. ¿En qué puedo ayudarte hoy?',
      esUsuario: false,
      fecha: new Date()
    });
  }

  async enviarMensaje() {
    if (!this.nuevoMensaje.trim()) return;

    // Agregar mensaje del usuario
    this.mensajes.push({
      texto: this.nuevoMensaje,
      esUsuario: true,
      fecha: new Date()
    });

    const pregunta = this.nuevoMensaje;
    this.nuevoMensaje = '';
    this.isLoading = true;

    // Llamar a la IA
    const respuestaIA = await this.aiService.getResponse(pregunta);

    this.mensajes.push({
      texto: respuestaIA,
      esUsuario: false,
      fecha: new Date()
    });
    this.isLoading = false;
  }

  limpiarChat() {
    this.mensajes = [{
      texto: '¡Hola! Soy el asistente de Nexo Desk, potenciado con inteligencia artificial. ¿En qué puedo ayudarte hoy?',
      esUsuario: false,
      fecha: new Date()
    }];
  }
}