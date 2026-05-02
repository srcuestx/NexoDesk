import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Breadcrumb {
  label: string;
  url: string;
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private breadcrumbsSubject = new BehaviorSubject<Breadcrumb[]>([]);
  breadcrumbs$ = this.breadcrumbsSubject.asObservable();

  updateBreadcrumbs(url: string) {
    console.log('URL actual:', url);
    
    // Si es la landing page o está vacío
    if (url === '/landing' || url === '/' || url === '') {
      this.breadcrumbsSubject.next([{ label: 'Inicio', url: '/landing', icon: 'home-outline' }]);
      return;
    }
    
    const breadcrumbs: Breadcrumb[] = [];
    breadcrumbs.push({ label: 'Inicio', url: '/landing', icon: 'home-outline' });
    
    // Mapeo de rutas a nombres legibles
    const routeNames: { [key: string]: string } = {
      'dashboard': 'Dashboard',
      'create-ticket': 'Crear Ticket',
      'ticket-detail': 'Detalle del Ticket',
      'chatbot': 'Asistente IA',
      'payment': 'Soporte Urgente',
      'admin': 'Panel Admin',
      'admin/tickets': 'Gestionar Tickets',
      'login': 'Iniciar Sesión',
      'register': 'Registrarse'
    };
    
    const segments = url.split('/').filter(s => s && s !== '');
    let currentPath = '';
    
    for (const segment of segments) {
      currentPath += `/${segment}`;
      
      // Buscar nombre legible
      let label = routeNames[segment];
      
      // Si no encuentra, podría ser un ID de ticket
      if (!label && segment.length > 10) {
        label = 'Ticket #' + segment.substring(0, 8);
      } else if (!label) {
        label = segment;
      }
      
      breadcrumbs.push({
        label: label,
        url: currentPath,
        icon: this.getIconForRoute(segment)
      });
    }
    
    console.log('Migas de pan:', breadcrumbs);
    this.breadcrumbsSubject.next(breadcrumbs);
  }
  
  private getIconForRoute(route: string): string {
    const icons: { [key: string]: string } = {
      'dashboard': 'home-outline',
      'create-ticket': 'add-circle-outline',
      'chatbot': 'chatbubble-outline',
      'payment': 'card-outline',
      'admin': 'speedometer-outline',
      'admin/tickets': 'list-outline',
      'login': 'log-in-outline',
      'register': 'person-add-outline'
    };
    return icons[route] || 'arrow-forward-outline';
  }
}