import { z } from "zod"

export class ProductoController {
    constructor(productoService) {
        this.productoService = productoService;
    }

    async buscarTodos(req, res) {
        const paginationResult = paginationSchema.safeParse(req.query);
        if (!paginationResult.success) {
            return res.status(400).json(paginationResult.error.issues);
        }
        const {page, limit} = paginationResult.data;

        const filterResult = filterSchema.safeParse(req.query);
        if (!filterResult.success) {
            return res.status(400).json(filterResult.error.issues);
        }
        const filtros = filterResult.data;

        const productosPaginados = await this.productoService.buscarTodos(page, limit, filtros)
        if(!productosPaginados) {
            return res.status(204).send()
        }

        res.status(200).json(productosPaginados)
    }

    async buscarPorId(req, res) {
        const result = objectIdSchema.safeParse(req.params.id);
        if (!result.success) {
            return res.status(400).json(result.error.issues);
        }
        const productId = result.data;

        const producto = await this.productoService.buscarPorId(productId);
        res.status(200).json(producto);
    }

    async crearProducto(req, res) {
        try{
                let fotosUrls = [];
                if (req.files && req.files.length > 0) {
                    fotosUrls = req.files.map(file => file.path);
                }

                let categorias = req.body.categorias;
                if (typeof categorias === 'string') {
                try {
                    categorias = JSON.parse(categorias);
                } catch (e) {
                    categorias = []; 
                }
            }
            const productData = {
                ...req.body,
                precio: Number(req.body.precio), 
                stock: Number(req.body.stock),
                activo: req.body.activo === 'true' || req.body.activo === true, 
                categorias: categorias,
                fotos: fotosUrls,
                vendedor: req.user.id
            }

            const productDataResult = createProductoSchema.safeParse(productData);
            if (!productDataResult.success) {
                return res.status(400).json(productDataResult.error.issues);
            }

            const validProductData = {
                ...productDataResult.data,
                vendedor: req.user.id //para que zod no me saque el vendedor
            };

            const nuevoProducto = await this.productoService.crearProducto(validProductData);
            res.status(201).json({message : "producto creado exitosamente", producto: nuevoProducto});
        }catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async actualizarStock(req, res) {
        const idResult = objectIdSchema.safeParse(req.params.id);
        if (!idResult.success) {
            return res.status(400).json({
                error: "ID de producto inválido",
                details: idResult.error.issues
            });
        }
        const productoId = idResult.data;

        const stockResult = updateStockSchema.safeParse(req.body);
        if (!stockResult.success) {
            return res.status(400).json({
                error: "Datos de stock inválidos",
                details: stockResult.error.issues
            });
        }
        const { stock } = stockResult.data;

        const productoActualizado = await this.productoService.actualizarStock(
            productoId, 
            stock, 
            req.user.id
        );

        res.status(200).json({
            message: "Stock actualizado exitosamente",
            producto: productoActualizado
        });
    }

}

const paginationSchema = z.object({
    page: z
        .string()
        .transform(v => Number(v))
        .pipe(z.number().int().positive())
        .default("1"),
    limit: z
        .string()
        .transform(v => Number(v))
        .pipe(z.number().int().min(1).max(100))
        .default("10")
});

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Id inválido');
const objectIdArraySchema = z.union([
    objectIdSchema,
    z.array(objectIdSchema)
]).transform(val => (Array.isArray(val) ? val : [val]));

const monedaSchema = z.enum(["PESO_ARG", "DOLAR_USA", "REAL"]);

const categoriaInputSchema = z.object({
    _id: objectIdSchema,
    nombre: z.string().min(1, "El nombre de la categoría es obligatorio")
});

export const createProductoSchema = z.object({
    titulo: z.string().min(3, "El título debe tener al menos 3 caracteres").max(100, "El título es muy largo"),
    descripcion: z.string().min(10, "La descripción debe ser más detallada"),
    categorias: z.array(categoriaInputSchema).min(1, "Debes asignar al menos una categoría"),
    precio: z.number().positive("El precio debe ser mayor a 0"),
    moneda: monedaSchema,
    stock: z.number()
        .int("El stock debe ser un número entero")
        .min(0, "El stock no puede ser negativo"),
    fotos: z.array(z.string().url("Debe ser una URL válida")).optional().default([]),    
    activo: z.boolean().optional().default(true),
});

export const productoEntitySchema = z.object({
    _id: objectIdSchema,
    vendedor: objectIdSchema,
    titulo: z.string(),
    descripcion: z.string(),
    categorias: z.array(categoriaInputSchema),
    precio: z.number(),
    moneda: monedaSchema,
    stock: z.number(),
    fotos: z.array(z.string()),
    activo: z.boolean(),
    cantidadVendida: z.number().default(0)
});

const filterSchema = z.object({
    vendedor: objectIdSchema.optional(),
    titulo: z.string().optional(),
    descripcion: z.string().optional(),
    categorias: objectIdArraySchema.optional(),
    precioMin: z
        .string()
        .transform(v => Number(v))
        .pipe(z.number().positive())
        .optional(),
    precioMax: z
        .string()
        .transform(v => Number(v))
        .pipe(z.number().positive())
        .optional(),
    orderBy: z.enum(["precio_asc", "precio_desc", "ventas_desc", "fecha_creacion_desc"]).optional()
}).refine(
    (data) => {
        if (data.precioMin !== undefined && data.precioMax !== undefined) {
            return data.precioMax >= data.precioMin;
        }
        return true;
    },
    {
        message: "precioMax debe ser mayor o igual que precioMin",
        path: ["precioMax"]
    }
);

const updateStockSchema = z.object({
    stock: z.number()
        .int("El stock debe ser un número entero")
        .min(0, "El stock no puede ser negativo")
        .describe("Nuevo stock del producto")
});