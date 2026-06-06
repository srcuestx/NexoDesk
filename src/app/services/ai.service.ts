import { Injectable } from '@angular/core';

interface Regla {
  palabras: string[];
  respuesta: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiService {

  private readonly REGLAS: Regla[] = [
    // ── Batería ──────────────────────────────────────────
    {
      palabras: ['batería', 'bateria', 'carga', 'cargando', 'no carga', 'se descarga', 'dura poco', 'agota'],
      respuesta: `🔋 *Problemas de batería o carga*\n\nPuedes intentar lo siguiente:\n1. Verifica que el cable y el cargador estén en buen estado.\n2. Limpia el puerto de carga con aire comprimido.\n3. Reinicia el dispositivo y vuelve a cargar.\n4. Si la batería dura muy poco, puede necesitar reemplazo.\n\nSi el problema persiste, puedo ayudarte a crear un ticket de soporte. 🎫`
    },
    // ── Pantalla ─────────────────────────────────────────
    {
      palabras: ['pantalla', 'screen', 'pixeles', 'píxeles', 'parpadea', 'parpadeo', 'parpadeando', 'negro', 'negra', 'no enciende', 'no se ve', 'brillo', 'oscura', 'oscuro', 'manchas', 'líneas', 'lineas'],
      respuesta: `🖥️ *Problemas de pantalla*\n\nSigue estos pasos:\n1. Ajusta el brillo desde la configuración.\n2. Reinicia el equipo — a veces el parpadeo es software.\n3. Verifica que los cables de video estén bien conectados (en PC de escritorio).\n4. Si hay líneas o manchas físicas, puede ser daño en el panel.\n\nSi necesitas revisión técnica, crea un ticket y un técnico te contactará. 🎫`
    },
    // ── PC lenta ─────────────────────────────────────────
    {
      palabras: ['lenta', 'lento', 'tarda', 'despacio', 'lentitud', 'cuelga', 'congela', 'congelada', 'congelado', 'tarda mucho', 'demora'],
      respuesta: `🐢 *Equipo lento o que se congela*\n\nPrueba esto:\n1. Reinicia el equipo y espera que cargue completamente.\n2. Cierra programas que no estés usando.\n3. Verifica que no haya actualizaciones pendientes.\n4. Ejecuta el antivirus — puede ser malware.\n5. Si tiene poco espacio en disco, elimina archivos temporales.\n\n¿El problema comenzó de repente o lleva tiempo así? Puedo abrir un ticket si lo necesitas. 🎫`
    },
    // ── Internet / Red ───────────────────────────────────
    {
      palabras: ['internet', 'red', 'wifi', 'conexión', 'conexion', 'no conecta', 'sin conexión', 'sin internet', 'lento internet', 'cae la red', 'ethernet'],
      respuesta: `🌐 *Problemas de conexión a internet*\n\nSigue estos pasos:\n1. Reinicia el router y el equipo.\n2. Verifica que el WiFi esté activado en el dispositivo.\n3. Olvida la red WiFi y conéctate de nuevo.\n4. Prueba con cable ethernet para descartar el WiFi.\n5. Si otros dispositivos tampoco conectan, el problema puede ser del proveedor de internet.\n\nSi la red es corporativa y solo te pasa a ti, crea un ticket. 🎫`
    },
    // ── Cámara ───────────────────────────────────────────
    {
      palabras: ['cámara', 'camara', 'foto', 'fotos', 'imagen borrosa', 'no enfoca', 'webcam', 'videollamada', 'no funciona cámara'],
      respuesta: `📷 *Problemas con la cámara*\n\nPrueba lo siguiente:\n1. Limpia el lente con un paño suave.\n2. Cierra otras aplicaciones que puedan estar usando la cámara.\n3. Verifica que la app tenga permisos de cámara en la configuración.\n4. Reinicia la aplicación o el dispositivo.\n5. En PC, verifica que los drivers de la webcam estén actualizados.\n\nSi la cámara sigue sin funcionar, podría ser un fallo de hardware. ¿Abro un ticket? 🎫`
    },
    // ── Sonido / Audio ───────────────────────────────────
    {
      palabras: ['sonido', 'audio', 'sin sonido', 'no suena', 'volumen', 'parlante', 'altavoz', 'auricular', 'audífono', 'microfono', 'micrófono', 'no escucha'],
      respuesta: `🔊 *Problemas de audio o sonido*\n\nSigue estos pasos:\n1. Verifica que el volumen no esté en silencio o muy bajo.\n2. Desconecta y reconecta los auriculares.\n3. Revisa en la configuración de sonido que el dispositivo correcto esté seleccionado.\n4. Reinicia el equipo.\n5. En PC, actualiza los drivers de audio.\n\nSi el problema persiste, puedo crear un ticket de soporte técnico. 🎫`
    },
    // ── Teclado / Mouse ──────────────────────────────────
    {
      palabras: ['teclado', 'mouse', 'ratón', 'raton', 'no escribe', 'tecla', 'cursor', 'no responde mouse', 'touchpad', 'trackpad'],
      respuesta: `⌨️ *Problemas con teclado o mouse*\n\nPrueba esto:\n1. Desconecta y vuelve a conectar el dispositivo.\n2. Prueba en otro puerto USB.\n3. Revisa si necesita baterías (si es inalámbrico).\n4. Reinicia el equipo.\n5. Prueba el teclado o mouse en otro equipo para saber si el fallo es del periférico.\n\n¿Necesitas que registre un ticket para reemplazo del equipo? 🎫`
    },
    // ── Impresora ────────────────────────────────────────
    {
      palabras: ['impresora', 'imprimir', 'imprime', 'no imprime', 'papel', 'tinta', 'tóner', 'toner', 'atasco'],
      respuesta: `🖨️ *Problemas con la impresora*\n\nSigue estos pasos:\n1. Verifica que la impresora esté encendida y conectada.\n2. Revisa si hay papel atascado y retíralo con cuidado.\n3. Comprueba los niveles de tinta o tóner.\n4. Cancela todos los trabajos de impresión pendientes y vuelve a intentar.\n5. Reinicia la impresora y el equipo.\n\nSi necesitas tóner o hay un daño físico, crea un ticket. 🎫`
    },
    // ── Virus / Malware ──────────────────────────────────
    {
      palabras: ['virus', 'malware', 'infectado', 'antivirus', 'hackeado', 'hacker', 'sospechoso', 'pop-up', 'popup', 'publicidad'],
      respuesta: `🦠 *Posible virus o malware*\n\nActúa así:\n1. No hagas clic en ventanas emergentes sospechosas.\n2. Ejecuta un análisis completo con el antivirus instalado.\n3. No ingreses contraseñas ni datos bancarios hasta resolver el problema.\n4. Si el equipo es corporativo, no lo uses hasta recibir soporte.\n\nEsto requiere atención urgente — te recomiendo crear un ticket de prioridad alta. 🎫`
    },
    // ── Contraseña / Acceso ──────────────────────────────
    {
      palabras: ['contraseña', 'contrasena', 'clave', 'password', 'no puedo entrar', 'bloqueado', 'acceso', 'usuario', 'login', 'sesión', 'sesion'],
      respuesta: `🔑 *Problemas de acceso o contraseña*\n\nSigue estos pasos:\n1. Verifica que el Bloq Mayús no esté activado.\n2. Usa la opción "Olvidé mi contraseña" si está disponible.\n3. Si es un equipo corporativo, contacta al administrador del sistema.\n4. No compartas tu contraseña con nadie.\n\nSi necesitas restablecimiento de contraseña, crea un ticket y lo gestionamos. 🎫`
    },
    // ── Almacenamiento / Disco ───────────────────────────
    {
      palabras: ['disco', 'almacenamiento', 'espacio', 'lleno', 'memoria', 'storage', 'no guarda', 'sin espacio', 'full'],
      respuesta: `💾 *Problemas de almacenamiento*\n\nPrueba lo siguiente:\n1. Elimina archivos temporales (Windows: %temp% en el buscador).\n2. Vacía la papelera de reciclaje.\n3. Desinstala programas que no uses.\n4. Mueve archivos grandes a una unidad externa o la nube.\n5. Si el disco tiene errores, ejecuta una verificación de disco.\n\nSi necesitas ampliar el almacenamiento, puedo crear un ticket. 🎫`
    },
    // ── App / Software ───────────────────────────────────
    {
      palabras: ['aplicación', 'aplicacion', 'app', 'programa', 'software', 'se cierra', 'no abre', 'error', 'falla', 'crashea', 'crash'],
      respuesta: `💻 *Aplicación con fallos o que no abre*\n\nSigue estos pasos:\n1. Cierra completamente la app y vuelve a abrirla.\n2. Reinicia el equipo.\n3. Verifica si hay actualizaciones disponibles de la aplicación.\n4. Desinstala y vuelve a instalar el programa.\n5. Revisa si hay mensajes de error específicos al abrirla.\n\n¿Qué aplicación está fallando? Puedo registrar el incidente. 🎫`
    },
    // ── Ticket ───────────────────────────────────────────
    {
      palabras: ['ticket', 'incidente', 'reporte', 'reportar', 'crear ticket', 'abrir ticket', 'soporte', 'ayuda', 'técnico', 'tecnico'],
      respuesta: `🎫 *Crear un ticket de soporte*\n\nPuedes registrar tu incidente directamente en NexoDesk:\n1. Ve al menú principal → "Tickets".\n2. Haz clic en "Nuevo ticket".\n3. Describe el problema, selecciona la categoría y la prioridad.\n4. Un técnico te será asignado pronto.\n\n¿Quieres que te guíe con algún paso específico?`
    },
    // ── Urgente ──────────────────────────────────────────
    {
      palabras: ['urgente', 'urgencia', 'emergencia', 'crítico', 'critico', 'no puedo trabajar', 'bloqueado trabajo'],
      respuesta: `🚨 *Soporte urgente*\n\nEntiendo que es urgente. Por favor:\n1. Crea un ticket inmediatamente con prioridad *Alta*.\n2. Describe brevemente qué pasó y desde cuándo.\n3. Un técnico será asignado con prioridad.\n\nPuedo guiarte para crear el ticket ahora mismo si lo necesitas. 🎫`
    },
  ];

  private readonly SALUDO_PALABRAS = ['hola', 'buenos', 'buenas', 'hey', 'hi', 'saludos', 'buen día', 'buen dia'];
  private readonly DESPEDIDA_PALABRAS = ['gracias', 'bye', 'adiós', 'adios', 'hasta luego', 'chao', 'listo', 'ok gracias'];

  async getResponse(pregunta: string): Promise<string> {
    const texto = pregunta.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // Saludo
    if (this.SALUDO_PALABRAS.some(p => texto.includes(p))) {
      return `👋 ¡Hola! Soy el asistente de soporte de NexoDesk.\n\nPuedo ayudarte con problemas como:\n• 🔋 Batería o carga\n• 🖥️ Pantalla\n• 🐢 PC lenta\n• 🌐 Internet o red\n• 📷 Cámara\n• 🔊 Audio\n• ⌨️ Teclado o mouse\n• 🖨️ Impresora\n• 🦠 Virus o malware\n• 🔑 Contraseñas\n• 💾 Almacenamiento\n• 💻 Aplicaciones\n\nCuéntame qué problema tienes y te ayudo. 😊`;
    }

    // Despedida
    if (this.DESPEDIDA_PALABRAS.some(p => texto.includes(p))) {
      return `😊 ¡Con gusto! Si tienes otro problema no dudes en escribirme. Recuerda que puedes crear un ticket en cualquier momento desde el menú de NexoDesk. ¡Hasta pronto! 👋`;
    }

    // Buscar regla que coincida
    for (const regla of this.REGLAS) {
      if (regla.palabras.some(p => texto.includes(p))) {
        return regla.respuesta;
      }
    }

    // Respuesta por defecto
    return `🤔 No estoy seguro de entender tu problema.\n\nPuedo ayudarte con:\n• Batería o carga\n• Pantalla\n• PC lenta\n• Internet o red\n• Cámara\n• Audio\n• Teclado o mouse\n• Impresora\n• Virus\n• Contraseñas\n• Almacenamiento\n• Aplicaciones\n\nDescribe tu problema con más detalle o crea un ticket de soporte. 🎫`;
  }

  limpiarHistorial() {
    // No hay historial en modo local, pero se mantiene el método para compatibilidad
  }
}