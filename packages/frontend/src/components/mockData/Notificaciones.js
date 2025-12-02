export const Notificaciones = [
  {
    id: 1,
    title: 'Pedido confirmado',
    message: 'Tu pedido #12345 ha sido confirmado y está siendo procesado.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutos atrás
    read: false,
    type: 'order'
  },
  {
    id: 2,
    title: 'Oferta especial',
    message: 'Descuento del 30% en productos seleccionados. ¡No te lo pierdas!',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
    read: false,
    type: 'promotion'
  },
  {
    id: 3,
    title: 'Producto en stock',
    message: 'El producto "Smartphone XYZ" que esperabas ya está disponible.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 día atrás
    read: true,
    type: 'stock'
  },
  {
    id: 4,
    title: 'Envío en camino',
    message: 'Tu pedido #12340 ha sido enviado y llegará en 2-3 días hábiles.',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 días atrás
    read: true,
    type: 'shipping'
  },
  {
    id: 5,
    title: 'Recordatorio de carrito',
    message: 'Tienes productos en tu carrito esperándote. ¡Completa tu compra!',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 horas atrás
    read: false,
    type: 'reminder'
  },
  {
    id: 6,
    title: 'Nueva reseña',
    message: 'Alguien ha valorado un producto que compraste. ¡Mira qué dicen!',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 horas atrás
    read: true,
    type: 'review'
  },
  {
    id: 7,
    title: 'Actualización de política',
    message: 'Hemos actualizado nuestros términos y condiciones.',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 días atrás
    read: true,
    type: 'system'
  }
];