const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.assignTicketAutomatically = functions.database
  .ref('/tickets/{userId}/{ticketId}')
  .onCreate(async (snapshot, context) => {
    const ticket = snapshot.val();
    const ticketRef = snapshot.ref;
    const db = admin.database();

    // Obtener la lista de técnicos y el último índice asignado
    const systemSnapshot = await db.ref('system').once('value');
    const system = systemSnapshot.val() || { lastAssignedIndex: 0, technicians: [] };
    const technicians = system.technicians || [];
    if (technicians.length === 0) {
      console.log('No hay técnicos configurados');
      return null;
    }

    let lastIndex = system.lastAssignedIndex || 0;
    const nextIndex = (lastIndex + 1) % technicians.length;
    const assignedTo = technicians[nextIndex];

    // Historial
    const history = ticket.history || [];
    history.push({
      action: 'asignado automáticamente',
      by: 'sistema',
      to: assignedTo,
      at: new Date().toISOString()
    });

    // Actualizar el ticket
    await ticketRef.update({
      assignedTo: assignedTo,
      assignedAt: new Date().toISOString(),
      history: history
    });

    // Actualizar el último índice
    await db.ref('system').update({ lastAssignedIndex: nextIndex });

    console.log(`Ticket ${context.params.ticketId} asignado a ${assignedTo}`);
    return null;
  });