import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonContent, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, IonContent, IonButton]
})
export class LandingPage {
  constructor() {}
}