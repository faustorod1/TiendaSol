

export class CategoriaController {
    constructor(categoriaService) {
        this.categoriaService = categoriaService;
    }

    async buscarTodos(_req, res) {
        const categorias = await this.categoriaService.buscarTodos();
        if (!categorias) {
            return res.status(204).send();
        }
        res.status(200).json(categorias);
    }
}