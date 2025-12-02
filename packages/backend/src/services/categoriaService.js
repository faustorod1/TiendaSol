
export class CategoriaService {
    constructor(categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    async buscarTodos() {
        return await this.categoriaRepository.findAll();
    }
}