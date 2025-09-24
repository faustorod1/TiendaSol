import { z } from "zod"

export class productoController {
    constructor(productoService) {
        this.productoService = productoService;
    }

    buscarTodos(req, res) {
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

        const productosPaginados = this.productoService.buscarTodos(page, limit, filtros)
        if(!productosPaginados) {
            return res.status(204).send()
        }

        res.status(200).json(productosPaginados)
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

const filterSchema = z.object({
    vendedor: z.string().optional(),
    titulo: z.string().optional(),
    categoria: z.string().optional(),
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
    orderBy: z.enum(["precio_asc", "precio_desc", "ventas_desc"]).optional()
}).refine(
    (data) => {
        if (data.precioMin !== undefined && data.precioMax !== undefined) {
            return data.precioMax >= data.precioMin;
        }
        return true;
    },
    {
        message: "precioMax debe ser mayor o igual que precioMin",
        path: [precioMax]
    }
);