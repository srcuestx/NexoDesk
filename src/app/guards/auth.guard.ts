import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { getAuth } from 'firebase/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = getAuth();
  const user = auth.currentUser;
  
  console.log('🔐 AuthGuard - Usuario:', user?.email || 'No hay usuario');
  
  if (user) {
    console.log('✅ AuthGuard - Acceso permitido');
    return true;
  } else {
    console.log('❌ AuthGuard - Acceso denegado, redirigiendo a login');
    router.navigate(['/login']);
    return false;
  }
};