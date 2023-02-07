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

    async getCart() {
        if (fs.existsSync(this.path)) {
            const carritos = await fs.promises.readFile(this.path, 'utf-8')
            const carritosJS = JSON.parse(carritos)
            this.cart = carritosJS
            return (this.cart)
        } else {
            return ('')
        }
    };

    async getCartById(id) {
        await this.getCart();
        const encontrado = this.cart.find((carrito) => carrito.id === id);
        if (encontrado == undefined) {
            console.log(`Error: cart id ${id} cannot be found to retrieve.`);
            return ('');
        } else {
            return ({ encontrado }); // En formato objeto
        }
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