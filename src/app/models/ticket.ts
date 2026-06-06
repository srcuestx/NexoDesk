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
  assignedTo?: string;        // técnico asignado
  assignedAt?: string;        // fecha de asignación
  response?: string;
  isPaid: boolean;
  paymentId?: string;
  history?: Array<{           // historial de acciones
    action: string;
    by: string;
    to?: string;
    from?: string;
    at: string;
  }>;
}