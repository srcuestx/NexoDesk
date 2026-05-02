export interface Ticket {
  id?: string;
  title: string;
  description: string;
  priority: 'baja' | 'media' | 'alta' | 'urgente';
  status: 'abierto' | 'en_proceso' | 'resuelto' | 'cerrado';
  createdAt: Date;
  updatedAt?: Date;
  userId: string;
  userEmail: string;
  assignedTo?: string;
  response?: string;
  isPaid: boolean;
  paymentId?: string;
}