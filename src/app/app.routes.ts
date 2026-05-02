import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  // Rutas públicas (sin login)
  {
    path: 'landing',
    loadComponent: () => import('./pages/landing/landing.page').then(m => m.LandingPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/forgot-password/forgot-password.page').then(m => m.ForgotPasswordPage)
  },
  {
    path: 'setup-admin',
    loadComponent: () => import('./pages/setup-admin/setup-admin.page').then(m => m.SetupAdminPage)
  },

  // Rutas protegidas (requieren login)
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then(m => m.DashboardPage),
    canActivate: [authGuard]
  },
  {
    path: 'create-ticket',
    loadComponent: () => import('./pages/create-ticket/create-ticket.page').then(m => m.CreateTicketPage),
    canActivate: [authGuard]
  },
  {
    path: 'ticket-detail/:id',
    loadComponent: () => import('./pages/ticket-detail/ticket-detail.page').then(m => m.TicketDetailPage),
    canActivate: [authGuard]
  },
  {
    path: 'chatbot',
    loadComponent: () => import('./pages/chatbot/chatbot.page').then(m => m.ChatbotPage),
    canActivate: [authGuard]
  },
  {
    path: 'payment',
    loadComponent: () => import('./pages/payment/payment.page').then(m => m.PaymentPage),
    canActivate: [authGuard]
  },

  // Rutas de administrador
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin-dashboard/admin-dashboard.page').then(m => m.AdminDashboardPage),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/tickets',
    loadComponent: () => import('./pages/admin/manage-tickets/manage-tickets.page').then(m => m.ManageTicketsPage),
    canActivate: [authGuard, adminGuard]
  },

  // Redirecciones
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'landing'
  }
];