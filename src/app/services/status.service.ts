import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface ServiceStatus {
  name: string;
  status: 'operativo' | 'lento' | 'caido' | 'mantenimiento';
  message: string;
  lastCheck: Date;
}

@Injectable({
  providedIn: 'root'
})
export class StatusService {
  
  // Datos simulados (en producción se consumiría una API real)
  getServicesStatus(): Observable<ServiceStatus[]> {
    const statuses: ServiceStatus[] = [
      {
        name: 'Gmail',
        status: 'operativo',
        message: 'Funcionando normalmente',
        lastCheck: new Date()
      },
      {
        name: 'Google Drive',
        status: 'operativo',
        message: 'Funcionando normalmente',
        lastCheck: new Date()
      },
      {
        name: 'Microsoft Teams',
        status: 'lento',
        message: 'Latencia alta reportada',
        lastCheck: new Date()
      },
      {
        name: 'VPN Corporativa',
        status: 'caido',
        message: 'Caído - Equipo trabajando en solución',
        lastCheck: new Date()
      },
      {
        name: 'Servidor de Correo',
        status: 'operativo',
        message: 'Funcionando normalmente',
        lastCheck: new Date()
      },
      {
        name: 'Base de Datos',
        status: 'mantenimiento',
        message: 'Mantenimiento programado hasta las 18:00',
        lastCheck: new Date()
      }
    ];
    
    return of(statuses);
  }

  // Método para obtener el color según el estado
  getStatusColor(status: string): string {
    switch(status) {
      case 'operativo': return 'success';
      case 'lento': return 'warning';
      case 'caido': return 'danger';
      case 'mantenimiento': return 'medium';
      default: return 'medium';
    }
  }

  // Método para obtener el icono según el estado
  getStatusIcon(status: string): string {
    switch(status) {
      case 'operativo': return 'checkmark-circle-outline';
      case 'lento': return 'time-outline';
      case 'caido': return 'close-circle-outline';
      case 'mantenimiento': return 'construct-outline';
      default: return 'help-circle-outline';
    }
  }

  // Método para obtener el texto en español
  getStatusText(status: string): string {
    switch(status) {
      case 'operativo': return 'Operativo';
      case 'lento': return 'Latencia alta';
      case 'caido': return 'Caído';
      case 'mantenimiento': return 'Mantenimiento';
      default: return 'Desconocido';
    }
  }
}