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
    },

    {
        id: "675123456789abcdef123459",
        comprador: {
            _id: "654c6c9a29a67a001a1d1d01",
            nombre: "Juan Pérez",
            email: "juan.perez@email.com"
        },
        vendedor: {
            _id: "654c6c9a29a67a001a1d1d07",
            nombre: "Carla Jiménez",
            email: "carla.jimenez@email.com"
        },
        items: [
            {
                producto: {
                    _id: "654c6c9a29a67a001a1d1d18",
                    titulo: "Auriculares Bluetooth Sony WH-CH720N",
                    precio: 45999,
                    fotos: ["https://example.com/sony-headphones.jpg"],
                    descripcion: "Auriculares inalámbricos con cancelación de ruido",
                    categorias: [{ nombre: "Electrónica" }]
                },
                cantidad: 1,
                precioUnitario: 45999,
                subtotal: function() { return this.cantidad * this.precioUnitario; }
            },
            {
                producto: {
                    _id: "654c6c9a29a67a001a1d1d19",
                    titulo: "Cargador Inalámbrico",
                    precio: 8999,
                    fotos: ["https://example.com/wireless-charger.jpg"],
                    descripcion: "Base de carga inalámbrica universal",
                    categorias: [{ nombre: "Accesorios" }]
                },
                cantidad: 1,
                precioUnitario: 8999,
                subtotal: function() { return this.cantidad * this.precioUnitario; }
            }
        ],
        moneda: "ARS",
        estado: "PENDIENTE",
        direccionEntrega: {
            calle: "Libertador 2345",
            ciudad: "Buenos Aires",
            provincia: "Buenos Aires",
            codigoPostal: "C1425ABC",
            pais: "Argentina"
        },
        fechaCreacion: new Date("2024-11-09T16:22:00Z"),
        historialEstados: [
            {
                estado: "PENDIENTE",
                fecha: new Date("2024-11-09T16:22:00Z"),
                observaciones: "Pedido creado y en espera de confirmación del vendedor"
            }
        ]
    },

    // NUEVOS PEDIDOS PARA PROBAR PAGINACIÓN

    {
        id: "675123456789abcdef123460",
        comprador: {
            _id: "654c6c9a29a67a001a1d1d01",
            nombre: "Juan Pérez",
            email: "juan.perez@email.com"
        },
        vendedor: {
            _id: "654c6c9a29a67a001a1d1d08",
            nombre: "Diego López",
            email: "diego.lopez@email.com"
        },
        items: [
            {
                producto: {
                    _id: "654c6c9a29a67a001a1d1d20",
                    titulo: "Smartwatch Amazfit GTS 3",
                    precio: 75999,
                    fotos: ["https://example.com/amazfit-gts3.jpg"],
                    descripcion: "Smartwatch con GPS y monitor de salud",
                    categorias: [{ nombre: "Electrónica" }]
                },
                cantidad: 1,
                precioUnitario: 75999,
                subtotal: function() { return this.cantidad * this.precioUnitario; }
            },
            {
                producto: {
                    _id: "654c6c9a29a67a001a1d1d21",
                    titulo: "Malla de Silicona para Smartwatch",
                    precio: 12999,
                    fotos: ["https://example.com/smartwatch-band.jpg"],
                    descripcion: "Malla de repuesto de silicona deportiva",
                    categorias: [{ nombre: "Accesorios" }]
                },
                cantidad: 2,
                precioUnitario: 12999,
                subtotal: function() { return this.cantidad * this.precioUnitario; }
            }
        ],
        moneda: "ARS",
        estado: "CONFIRMADO",
        direccionEntrega: {
            calle: "Belgrano 1567",
            ciudad: "La Plata",
            provincia: "Buenos Aires",
            codigoPostal: "B1900ABC",
            pais: "Argentina"
        },
        fechaCreacion: new Date("2024-11-08T11:45:00Z"),
        historialEstados: [
            {
                estado: "PENDIENTE",
                fecha: new Date("2024-11-08T11:45:00Z"),
                observaciones: "Pedido creado"
            },
            {
                estado: "CONFIRMADO",
                fecha: new Date("2024-11-08T14:30:00Z"),
                observaciones: "Pedido confirmado por el vendedor - Pago verificado"
            }
        ]
    },

    {
        id: "675123456789abcdef123461",
        comprador: {
            _id: "654c6c9a29a67a001a1d1d01",
            nombre: "Juan Pérez",
            email: "juan.perez@email.com"
        },
        vendedor: {
            _id: "654c6c9a29a67a001a1d1d09",
            nombre: "Sofía Ramírez",
            email: "sofia.ramirez@email.com"
        },
        items: [
            {
                producto: {
                    _id: "654c6c9a29a67a001a1d1d22",
                    titulo: "Tablet Samsung Galaxy Tab A8",
                    precio: 189999,
                    fotos: ["https://example.com/samsung-tablet.jpg"],
                    descripcion: "Tablet 10.5 pulgadas con 64GB de almacenamiento",
                    categorias: [{ nombre: "Electrónica" }]
                },
                cantidad: 1,
                precioUnitario: 189999,
                subtotal: function() { return this.cantidad * this.precioUnitario; }
            },
            {
                producto: {
                    _id: "654c6c9a29a67a001a1d1d23",
                    titulo: "Funda con Teclado para Tablet",
                    precio: 25999,
                    fotos: ["https://example.com/tablet-keyboard-case.jpg"],
                    descripcion: "Funda protectora con teclado Bluetooth integrado",
                    categorias: [{ nombre: "Accesorios" }]
                },
                cantidad: 1,
                precioUnitario: 25999,
                subtotal: function() { return this.cantidad * this.precioUnitario; }
            }
        ],
        moneda: "ARS",
        estado: "EN_PREPARACION",
        direccionEntrega: {
            calle: "9 de Julio 3421",
            ciudad: "Mar del Plata",
            provincia: "Buenos Aires",
            codigoPostal: "B7600ABC",
            pais: "Argentina"
        },
        fechaCreacion: new Date("2024-11-06T09:15:00Z"),
        historialEstados: [
            {
                estado: "PENDIENTE",
                fecha: new Date("2024-11-06T09:15:00Z"),
                observaciones: "Pedido creado"
            },
            {
                estado: "CONFIRMADO",
                fecha: new Date("2024-11-06T10:45:00Z"),
                observaciones: "Pedido confirmado por el vendedor"
            },
            {
                estado: "EN_PREPARACION",
                fecha: new Date("2024-11-07T08:30:00Z"),
                observaciones: "Preparando el pedido para envío"
            }
        ]
    },

    {
        id: "675123456789abcdef123462",
        comprador: {
            _id: "654c6c9a29a67a001a1d1d01",
            nombre: "Juan Pérez",
            email: "juan.perez@email.com"
        },
        vendedor: {
            _id: "654c6c9a29a67a001a1d1d10",
            nombre: "Martín Vega",
            email: "martin.vega@email.com"
        },
        items: [
            {
                producto: {
                    _id: "654c6c9a29a67a001a1d1d24",
                    titulo: "Campera de Cuero Vintage",
                    precio: 125999,
                    fotos: ["https://example.com/leather-jacket.jpg"],
                    descripcion: "Campera de cuero genuino estilo vintage",
                    categorias: [{ nombre: "Ropa y Calzado" }]
                },
                cantidad: 1,
                precioUnitario: 125999,
                subtotal: function() { return this.cantidad * this.precioUnitario; }
            },
            {
                producto: {
                    _id: "654c6c9a29a67a001a1d1d25",
                    titulo: "Jeans Levi's 501 Original",
                    precio: 65999,
                    fotos: ["https://example.com/levis-jeans.jpg"],
                    descripcion: "Jeans clásicos Levi's 501 talle 32",
                    categorias: [{ nombre: "Ropa y Calzado" }]
                },
                cantidad: 2,
                precioUnitario: 65999,
                subtotal: function() { return this.cantidad * this.precioUnitario; }
            },
            {
                producto: {
                    _id: "654c6c9a29a67a001a1d1d26",
                    titulo: "Cinturón de Cuero Negro",
                    precio: 18999,
                    fotos: ["https://example.com/leather-belt.jpg"],
                    descripcion: "Cinturón de cuero genuino color negro",
                    categorias: [{ nombre: "Accesorios" }]
                },
                cantidad: 1,
                precioUnitario: 18999,
                subtotal: function() { return this.cantidad * this.precioUnitario; }
            }
        ],
        moneda: "ARS",
        estado: "ENTREGADO",
        direccionEntrega: {
            calle: "Sarmiento 789",
            ciudad: "Mendoza",
            provincia: "Mendoza",
            codigoPostal: "M5500ABC",
            pais: "Argentina"
        },
        fechaCreacion: new Date("2024-10-25T13:20:00Z"),
        historialEstados: [
            {
                estado: "PENDIENTE",
                fecha: new Date("2024-10-25T13:20:00Z"),
                observaciones: "Pedido creado"
            },
            {
                estado: "CONFIRMADO",
                fecha: new Date("2024-10-25T15:00:00Z"),
                observaciones: "Pedido confirmado por el vendedor"
            },
            {
                estado: "EN_PREPARACION",
                fecha: new Date("2024-10-26T09:30:00Z"),
                observaciones: "Preparando productos para envío"
            },
            {
                estado: "ENVIADO",
                fecha: new Date("2024-10-27T11:15:00Z"),
                observaciones: "Enviado con Andreani - Tracking: AN789456123"
            },
            {
                estado: "ENTREGADO",
                fecha: new Date("2024-10-30T14:45:00Z"),
                observaciones: "Entregado exitosamente al destinatario"
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