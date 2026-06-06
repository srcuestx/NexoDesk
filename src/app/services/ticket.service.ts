import { Injectable } from '@angular/core';
import { getDatabase, ref, push, onValue, update, get, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { Ticket } from '../models/ticket';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private db = getDatabase();
  private auth = getAuth();

  getMyTickets(callback: (tickets: Ticket[]) => void): () => void {
    const user = this.auth.currentUser;
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

  getAllTickets(callback: (tickets: (Ticket & { userId: string })[]) => void): () => void {
    const ticketsRef = ref(this.db, `tickets`);
    return onValue(ticketsRef, (snapshot) => {
      const allTickets: (Ticket & { userId: string })[] = [];
      snapshot.forEach((userTickets) => {
        const userId = userTickets.key;
        userTickets.forEach((ticket: any) => {
          allTickets.push({
            id: ticket.key,
            ...ticket.val(),
            userId: userId
          });
        });
      });
      allTickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(allTickets);
    });
  }

  getTicketsByTechnician(technicianEmail: string, callback: (tickets: Ticket[]) => void): () => void {
    const ticketsRef = ref(this.db, `tickets`);
    return onValue(ticketsRef, (snapshot) => {
      const assignedTickets: Ticket[] = [];
      snapshot.forEach((userTickets) => {
        const userId = userTickets.key;
        userTickets.forEach((ticket: any) => {
          const ticketData = ticket.val();
          if (ticketData.assignedTo === technicianEmail) {
            assignedTickets.push({
              id: ticket.key,
              ...ticketData,
              userId: userId
            });
          }
        });
      });
      assignedTickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(assignedTickets);
    });
  }

  private async assignTicketAutomatically(ticketId: string, userId: string): Promise<void> {
    const systemRef = ref(this.db, 'system');
    const snapshot = await get(systemRef);
    let system = snapshot.val();
    if (!system) {
      system = { lastAssignedIndex: 0, technicians: [] };
      await set(systemRef, system);
    }
    const technicians = system.technicians || [];
    if (technicians.length === 0) return;
    let lastIndex = system.lastAssignedIndex ?? 0;
    const nextIndex = (lastIndex + 1) % technicians.length;
    const assignedTo = technicians[nextIndex];
    const ticketRef = ref(this.db, `tickets/${userId}/${ticketId}`);
    const ticketSnap = await get(ticketRef);
    const ticket = ticketSnap.val();
    const history = ticket.history || [];
    history.push({
      action: 'asignado automáticamente',
      by: 'sistema',
      to: assignedTo,
      at: new Date().toISOString()
    });
    await update(ticketRef, {
      assignedTo: assignedTo,
      assignedAt: new Date().toISOString(),
      history: history
    });
    await update(systemRef, { lastAssignedIndex: nextIndex });
  }

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
      userEmail: user.email || '',
      history: []
    };
    const ticketsRef = ref(this.db, `tickets/${user.uid}`);
    const result = await push(ticketsRef, newTicket);
    const ticketId = result.key!;
    await this.assignTicketAutomatically(ticketId, user.uid);
    return ticketId;
  }

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

  // ✅ CORREGIDO: maneja assignedTo undefined
  async reassignTicket(ticketId: string, userId: string, newTechnician: string): Promise<void> {
    const ticketRef = ref(this.db, `tickets/${userId}/${ticketId}`);
    const snap = await get(ticketRef);
    const ticket = snap.val();
    const history = ticket.history || [];
    const previousTechnician = ticket.assignedTo || 'no asignado';
    history.push({
      action: 'reasignado manualmente',
      by: this.auth.currentUser?.email || 'admin',
      from: previousTechnician,
      to: newTechnician,
      at: new Date().toISOString()
    });
    await update(ticketRef, {
      assignedTo: newTechnician,
      assignedAt: new Date().toISOString(),
      history: history
    });
  }

  async getTicketById(userId: string, ticketId: string): Promise<Ticket | null> {
    const ticketRef = ref(this.db, `tickets/${userId}/${ticketId}`);
    const snapshot = await get(ticketRef);
    if (snapshot.exists()) {
      return { id: snapshot.key, ...snapshot.val() } as Ticket;
    }
    return null;
  }

  // ✅ CORREGIDO: actorEmail nunca será undefined
  async updateTicketAdmin(ticketId: string, userId: string, updates: any, actionMessage: string, actorEmail: string): Promise<void> {
    const ticketRef = ref(this.db, `tickets/${userId}/${ticketId}`);
    const snapshot = await get(ticketRef);
    const ticket = snapshot.val();
    const history = ticket.history || [];
    const email = actorEmail || 'sistema';
    history.push({
      action: actionMessage,
      by: email,
      at: new Date().toISOString(),
      ...(updates.status && { to: updates.status }),
      ...(updates.response && { comment: updates.response })
    });
    await update(ticketRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
      history: history
    });
  }
}