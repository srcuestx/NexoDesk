import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { getAuth } from 'firebase/auth';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = getAuth();
  const user = auth.currentUser;
  
  // Lista de emails que son administradores (formato normal con puntos)
  const emailsAdmin = [
    'gloriarondon1234@gmail.com',
    'sergio.cuesta1234@gmail.com',
    'david.esteban@gmail.com'
  ];
  
  console.log('👑 AdminGuard - Verificando admin');
  console.log('📧 Usuario actual:', user?.email);
  console.log('📋 Lista admins:', emailsAdmin);
  
  if (!user) {
    console.log('❌ AdminGuard - No hay usuario');
    router.navigate(['/login']);
    return false;
  }

  const esAdmin = emailsAdmin.includes(user.email || '');
  console.log('👑 ¿Es admin?', esAdmin);
  
  if (esAdmin) {
    console.log('✅ AdminGuard - Acceso permitido');
    return true;
  } else {
    console.log('❌ AdminGuard - Acceso denegado');
    router.navigate(['/dashboard']);
    return false;
  }
};