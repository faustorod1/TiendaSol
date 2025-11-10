export const pedidos = [
    {
        id: "675123456789abcdef123456",
        comprador: {
            _id: "654c6c9a29a67a001a1d1d01",
            nombre: "Juan Pérez",
            email: "juan.perez@email.com"
        },
        vendedor: {
            _id: "654c6c9a29a67a001a1d1d02",
            nombre: "María González",
            email: "maria.gonzalez@email.com"
        },
        items: [
            {
                producto: {
                    _id: "654c6c9a29a67a001a1d1d10",
                    titulo: "Smartphone Samsung Galaxy A54",
                    precio: 299999,
                    fotos: ["https://example.com/samsung-galaxy-a54.jpg"],
                    descripcion: "Smartphone Samsung Galaxy A54 128GB",
                    categorias: [{ nombre: "Electrónica" }]
                },
                cantidad: 2,
                precioUnitario: 299999,
                subtotal: function() { return this.cantidad * this.precioUnitario; }
            },
            {
                producto: {
                    _id: "654c6c9a29a67a001a1d1d11",
                    titulo: "Funda Protectora Transparente",
                    precio: 15999,
                    fotos: ["https://example.com/funda-transparente.jpg"],
                    descripcion: "Funda protectora de silicona transparente",
                    categorias: [{ nombre: "Accesorios" }]
                },
                cantidad: 2,
                precioUnitario: 15999,
                subtotal: function() { return this.cantidad * this.precioUnitario; }
            }
        ],
        moneda: "ARS",
        estado: "ENTREGADO",
        direccionEntrega: {
            calle: "Av. Corrientes 1234",
            ciudad: "Buenos Aires",
            provincia: "Buenos Aires",
            codigoPostal: "C1043AAZ",
            pais: "Argentina"
        },
        fechaCreacion: new Date("2024-10-15T10:30:00Z"),
        historialEstados: [
            {
                estado: "PENDIENTE",
                fecha: new Date("2024-10-15T10:30:00Z"),
                observaciones: "Pedido creado y en espera de confirmación"
            },
            {
                estado: "CONFIRMADO",
                fecha: new Date("2024-10-15T11:15:00Z"),
                observaciones: "Pedido confirmado por el vendedor"
            },
            {
                estado: "EN_PREPARACION",
                fecha: new Date("2024-10-16T09:00:00Z"),
                observaciones: "Preparando productos para envío"
            },
            {
                estado: "ENVIADO",
                fecha: new Date("2024-10-17T14:30:00Z"),
                observaciones: "Enviado con correo - Tracking: AR123456789"
            },
            {
                estado: "ENTREGADO",
                fecha: new Date("2024-10-20T16:45:00Z"),
                observaciones: "Entregado exitosamente al destinatario"
            }
        ]
    },

    {
        id: "675123456789abcdef123457",
        comprador: {
            _id: "654c6c9a29a67a001a1d1d01",
            nombre: "Juan Pérez",
            email: "juan.perez@email.com"
        },
        vendedor: {
            _id: "654c6c9a29a67a001a1d1d04",
            nombre: "Ana Martínez",
            email: "ana.martinez@email.com"
        },
        items: [
            {
                producto: {
                    _id: "654c6c9a29a67a001a1d1d12",
                    titulo: "Zapatillas Nike Air Max",
                    precio: 89999,
                    fotos: ["https://example.com/nike-air-max.jpg"],
                    descripcion: "Zapatillas deportivas Nike Air Max talle 42",
                    categorias: [{ nombre: "Ropa y Calzado" }]
                },
                cantidad: 1,
                precioUnitario: 89999,
                subtotal: function() { return this.cantidad * this.precioUnitario; }
            }
        ],
        moneda: "ARS",
        estado: "ENVIADO",
        direccionEntrega: {
            calle: "San Martín 567",
            ciudad: "Rosario",
            provincia: "Santa Fe",
            codigoPostal: "S2000ABC",
            pais: "Argentina"
        },
        fechaCreacion: new Date("2024-11-05T14:20:00Z"),
        historialEstados: [
            {
                estado: "PENDIENTE",
                fecha: new Date("2024-11-05T14:20:00Z"),
                observaciones: "Pedido creado"
            },
            {
                estado: "CONFIRMADO",
                fecha: new Date("2024-11-05T15:30:00Z"),
                observaciones: "Pedido confirmado - Pago procesado"
            },
            {
                estado: "EN_PREPARACION",
                fecha: new Date("2024-11-06T10:00:00Z"),
                observaciones: "Preparando pedido para envío"
            },
            {
                estado: "ENVIADO",
                fecha: new Date("2024-11-07T13:15:00Z"),
                observaciones: "Enviado vía OCA - Tracking: 123456789AR"
            }
        ]
    },

    {
        id: "675123456789abcdef123458",
        comprador: {
            _id: "654c6c9a29a67a001a1d1d01",
            nombre: "Juan Pérez",
            email: "juan.perez@email.com"
        },
        vendedor: {
            _id: "654c6c9a29a67a001a1d1d06",
            nombre: "Roberto Silva",
            email: "roberto.silva@email.com"
        },
        items: [
            {
                producto: {
                    _id: "654c6c9a29a67a001a1d1d15",
                    titulo: "Laptop HP Pavilion 15.6",
                    precio: 699999,
                    fotos: ["https://example.com/hp-pavilion.jpg"],
                    descripcion: "Laptop HP Pavilion 15.6 Intel i5 8GB RAM 256GB SSD",
                    categorias: [{ nombre: "Electrónica" }]
                },
                cantidad: 1,
                precioUnitario: 699999,
                subtotal: function() { return this.cantidad * this.precioUnitario; }
            }
        ],
        moneda: "ARS",
        estado: "CANCELADO",
        direccionEntrega: {
            calle: "Mitre 890",
            ciudad: "Córdoba",
            provincia: "Córdoba",
            codigoPostal: "X5000ABC",
            pais: "Argentina"
        },
        fechaCreacion: new Date("2024-10-28T09:45:00Z"),
        historialEstados: [
            {
                estado: "PENDIENTE",
                fecha: new Date("2024-10-28T09:45:00Z"),
                observaciones: "Pedido creado"
            },
            {
                estado: "CONFIRMADO",
                fecha: new Date("2024-10-28T10:30:00Z"),
                observaciones: "Pedido confirmado por el vendedor"
            },
            {
                estado: "CANCELADO",
                fecha: new Date("2024-10-29T08:20:00Z"),
                observaciones: "Cancelado por el comprador - Producto sin stock"
            }
        ]
    }
];

// Funciones auxiliares
export const getPedidosByComprador = (compradorId) => {
    return pedidos.filter(pedido => pedido.comprador._id === compradorId);
};

export const getPedidosByVendedor = (vendedorId) => {
    return pedidos.filter(pedido => pedido.vendedor._id === vendedorId);
};

export const getPedidoById = (pedidoId) => {
    return pedidos.find(pedido => pedido.id === pedidoId);
};

export const calcularTotalPedido = (pedido) => {
    return pedido.items.reduce((total, item) => {
        return total + item.subtotal();
    }, 0);
};