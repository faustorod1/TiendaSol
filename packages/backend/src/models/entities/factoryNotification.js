export class FactoryNotification {

    //------- methods -------//

    /**
     * @param {EstadoPedido} estado
     */
    static crearMensajeSegunEstadoPedido(estado){
        let mensaje;
        switch(estado){
            case EstadoPedido.CANCELADO: 
                mensaje = "El pedido {{ID_PEDIDO}} ha sido cancelado.";
                break;
            case EstadoPedido.PENDIENTE: 
                mensaje = "El pedido {{ID_PEDIDO}} está pendiente. Los productos son: {{PRODUCTOS}}. El pedido fue realizado Por: {{COMPRADOR}}. La direccion de entrega es {{DIRECCION_ENTREGA}}. El importe total es {{TOTAL}}.";
                break;
            case EstadoPedido.CONFIRMADO: 
                mensaje = "El pedido {{ID_PEDIDO}} ha sido confirmado.";
                break;
            case EstadoPedido.EN_PREPARACION:
                mensaje = "El pedido {{ID_PEDIDO}} está en preparación.";
                break;
            case EstadoPedido.ENVIADO:
                mensaje = "El pedido {{ID_PEDIDO}} ha sido enviado a {{DIRECCION_ENTREGA}}.";
                break;
            case EstadoPedido.ENTREGADO:
                mensaje = "El pedido {{ID_PEDIDO}} ha sido entregado.";
                break;
            default:
                mensaje = "Estado del pedido {{ID_PEDIDO}} desconocido.";
                break;
        }
        return mensaje;
    }

    /**
     * Crea una notificación en caso de que el pedido esté en un estado que lo amerite, sino devuelve null.
     * @param {Pedido} pedido
     */
    static crearSegunPedido(pedido){
        const productos = pedido.items.map(item => item.producto);
        const nombresProductos = productos.map(prod => prod.nombre);

        let mensaje = FactoryNotification.crearMensajeSegunEstadoPedido(pedido.estado);
        mensaje = mensaje.replaceAll('{{ID_PEDIDO}}', pedido.id);
        mensaje = mensaje.replaceAll('{{COMPRADOR}}', pedido.comprador.nombre);
        mensaje = mensaje.replaceAll('{{PRODUCTOS}}', nombresProductos.join('\n'));
        mensaje = mensaje.replaceAll('{{TOTAL}}', pedido.calcularTotal());
        mensaje = mensaje.replaceAll('{{DIRECCION_ENTREGA}}', pedido.direccionEntrega.pasarAString());
        
        let destinatario;
        
        switch(pedido.estado){
            case EstadoPedido.PENDIENTE:
            case EstadoPedido.CANCELADO:
                destinatario = pedido.vendedor;
                break;
            case EstadoPedido.ENVIADO:
                destinatario = pedido.comprador;
                break;
            default:
                return null;
        }

        return new Notificacion(destinatario, mensaje);
    }
}