const Productos = [
  {
    id: "1",
    vendedor: {
      nombre: "ElectroMundo",
      email: "ventas@electromundo.com",
    },
    titulo: "Smart TV Samsung 50'' 4K UHD",
    descripcion:
      "Disfrutá tus series y películas favoritas con esta Smart TV Samsung de 50 pulgadas. Resolución 4K UHD, HDR10+, conexión Wi-Fi y Bluetooth, y sistema operativo Tizen.",
    categorias: ["Electrónica", "Televisores", "Samsung"],
    precio: 489999,
    moneda: "ARS",
    stock: 8,
    fotos: ["/images/tv-samsung-50.jpg"],
    activo: true,
    cantidadVendida: 15,
  },
  {
    id: "2",
    vendedor: {
      nombre: "Muebles Hogar",
      email: "contacto@muebleshogar.com",
    },
    titulo: "Silla Ergonómica de Oficina Negra",
    descripcion:
      "Silla giratoria con respaldo ergonómico, ajuste de altura, apoyabrazos acolchados y ruedas. Ideal para largas jornadas de trabajo desde casa o en oficina.",
    categorias: ["Muebles", "Oficina", "Sillas"],
    precio: 84999,
    moneda: "ARS",
    stock: 12,
    fotos: ["/images/silla-oficina-negra.jpg"],
    activo: true,
    cantidadVendida: 32,
  },
  {
    id: "3",
    vendedor: {
      nombre: "TechMarket",
      email: "soporte@techmarket.com",
    },
    titulo: "Auriculares Inalámbricos Xiaomi Redmi Buds 4",
    descripcion:
      "Auriculares Bluetooth con cancelación de ruido, estuche de carga, control táctil y hasta 6 horas de batería continua. Compatibles con Android y iOS.",
    categorias: ["Tecnología", "Audio", "Auriculares"],
    precio: 34999,
    moneda: "ARS",
    stock: 25,
    fotos: ["/images/redmi-buds-4.jpg"],
    activo: true,
    cantidadVendida: 50,
  },
  {
    id: "4",
    vendedor: {
      nombre: "Moda Urbana",
      email: "info@modaurbana.com",
    },
    titulo: "Zapatillas Nike Air Max Hombre",
    descripcion:
      "Zapatillas urbanas Nike Air Max con diseño moderno, suela amortiguada y gran confort. Disponibles en varios talles.",
    categorias: ["Calzado", "Moda", "Hombre"],
    precio: 115000,
    moneda: "ARS",
    stock: 6,
    fotos: ["/images/nike-airmax.jpg"],
    activo: true,
    cantidadVendida: 20,
  },
];

export { Productos };

