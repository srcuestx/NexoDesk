import { Injectable } from '@angular/core';
import { getDatabase, ref, push, onValue, update, get, query, orderByChild, equalTo } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { Ticket } from '../models/ticket';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private db = getDatabase();
  private auth = getAuth();

  // Obtener tickets del usuario actual
  getMyTickets(callback: (tickets: Ticket[]) => void): () => void {
    const user = this.auth.currentUser;
    console.log('getMyTickets - Usuario:', user?.email);
    
    if (!user) {
      callback([]);
      return () => {};
    }

    const ticketsRef = ref(this.db, `tickets/${user.uid}`);
    
    return onValue(ticketsRef, (snapshot) => {
      const tickets: Ticket[] = [];
      snapshot.forEach((child) => {
        tickets.push({
          id: child.key,
          ...child.val()
        });
      });
      tickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(tickets);
    });
  }

  // Obtener todos los tickets (solo admin)
  getAllTickets(callback: (tickets: Ticket[]) => void): () => void {
    const ticketsRef = ref(this.db, `tickets`);
    
    return onValue(ticketsRef, (snapshot) => {
      const allTickets: Ticket[] = [];
      snapshot.forEach((userTickets) => {
        userTickets.forEach((ticket: any) => {
          allTickets.push({
            id: ticket.key,
            ...ticket.val()
          });
        });
      });
      allTickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(allTickets);
    });
  }

  // Crear ticket
  async createTicket(ticket: any): Promise<string> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');

    const newTicket = {
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority,
      status: 'abierto',
      isPaid: false,
      createdAt: new Date().toISOString(),
      userId: user.uid,
      userEmail: user.email || ''
    };

    const ticketsRef = ref(this.db, `tickets/${user.uid}`);
    const result = await push(ticketsRef, newTicket);
    return result.key || '';
  }

  // Actualizar estado de un ticket
  async updateTicketStatus(ticketId: string, status: string): Promise<void> {
    const ticketsRef = ref(this.db, `tickets`);
    const snapshot = await get(ticketsRef);
    
    let foundPath = '';
    snapshot.forEach((userTickets) => {
      if (userTickets.child(ticketId).exists()) {
        foundPath = `tickets/${userTickets.key}/${ticketId}`;
      }
    });
    
    if (foundPath) {
      const ticketRef = ref(this.db, foundPath);
      await update(ticketRef, { status, updatedAt: new Date().toISOString() });
    }
  }

  // Agregar respuesta a un ticket
  async addResponse(ticketId: string, response: string): Promise<void> {
    const ticketsRef = ref(this.db, `tickets`);
    const snapshot = await get(ticketsRef);
    
    let foundPath = '';
    snapshot.forEach((userTickets) => {
      if (userTickets.child(ticketId).exists()) {
        foundPath = `tickets/${userTickets.key}/${ticketId}`;
      }
    });
    
    if (foundPath) {
      const ticketRef = ref(this.db, foundPath);
      await update(ticketRef, { 
        response, 
        status: 'en_proceso',
        updatedAt: new Date().toISOString() 
      });
    }
  }
}