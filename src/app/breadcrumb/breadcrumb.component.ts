import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { IonBreadcrumb, IonBreadcrumbs, IonIcon } from '@ionic/angular/standalone';
import { NavigationService, Breadcrumb } from '../services/navigation.service';
import { addIcons } from 'ionicons';
import { homeOutline, addCircleOutline, chatbubbleOutline, cardOutline, speedometerOutline, listOutline, logInOutline, personAddOutline, documentTextOutline, ticketOutline, arrowForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, IonBreadcrumb, IonBreadcrumbs, IonIcon]
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [];

  constructor(
    private navigationService: NavigationService,
    private router: Router
  ) {
    addIcons({
      homeOutline,
      addCircleOutline,
      chatbubbleOutline,
      cardOutline,
      speedometerOutline,
      listOutline,
      logInOutline,
      personAddOutline,
      documentTextOutline,
      ticketOutline,
      arrowForwardOutline
    });
  }

  ngOnInit() {
    // Suscribirse a cambios en las migas de pan
    this.navigationService.breadcrumbs$.subscribe((breadcrumbs: Breadcrumb[]) => {
      this.breadcrumbs = breadcrumbs;
      console.log('Breadcrumbs actualizados:', breadcrumbs);
    });

    // Actualizar cuando cambie la ruta
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log('Navegación a:', event.url);
        this.navigationService.updateBreadcrumbs(event.url);
      }
    });
    
    // Inicializar con la ruta actual
    this.navigationService.updateBreadcrumbs(this.router.url);
  }
}