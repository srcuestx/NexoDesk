import { Injectable } from '@angular/core';
import { getDatabase, ref, get, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private db = getDatabase();
  private auth = getAuth();

  // Verificar si un usuario es administrador
  async isAdmin(email: string): Promise<boolean> {
    if (!email) return false;
    
    const emailKey = email.replace(/\./g, ',');
    const adminRef = ref(this.db, `admins/${emailKey}`);
    const snapshot = await get(adminRef);
    
    return snapshot.exists() && snapshot.val() === true;
  }

  // Verificar si el usuario actual es admin
  async isCurrentUserAdmin(): Promise<boolean> {
    const user = this.auth.currentUser;
    if (!user || !user.email) return false;
    return this.isAdmin(user.email);
  }

  // Obtener todos los administradores (solo para super admin)
  async getAllAdmins(): Promise<string[]> {
    const adminsRef = ref(this.db, 'admins');
    const snapshot = await get(adminsRef);
    
    if (snapshot.exists()) {
      const admins = snapshot.val();
      return Object.keys(admins).map(key => key.replace(/,/g, '.'));
    }
    return [];
  }

  // Agregar un administrador (solo para admin)
  async addAdmin(email: string): Promise<boolean> {
    const isCurrentAdmin = await this.isCurrentUserAdmin();
    if (!isCurrentAdmin) return false;
    
    const emailKey = email.replace(/\./g, ',');
    const adminRef = ref(this.db, `admins/${emailKey}`);
    await set(adminRef, true);
    return true;
  }
}