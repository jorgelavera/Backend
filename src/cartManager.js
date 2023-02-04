import fs from 'fs';

export default class CartManager {
    constructor() {
        this.cart = []
        this.path = ''
    };

    //Al agregarlo, debe crearse con un id autoincrementable
    #generarId() {
        let id = 1
        if (this.cart.length !== 0) {
            id = this.cart[this.cart.length - 1].id + 1
        }
        return id
    };

    async grabarArchivo() {
        await fs.promises.writeFile(this.path, JSON.stringify(this.cart))
    };

    //Para poder setear el nombre del archivo desde afuera de la clase
    setPath(nombreArchivo) {
        this.path = nombreArchivo;
    };

    //
    async addCart() {
        const carrito = {
            id: this.#generarId(),
        }
        this.cart.push(carrito)
        await this.grabarArchivo()
    }
};