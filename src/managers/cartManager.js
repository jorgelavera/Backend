import fs from 'fs';

export default class CartManager {
    constructor() {
        this.carts = []
        this.path = ''
    };

    //Al agregarlo, debe crearse con un id autoincrementable
    #generarId() {
        let id = 1
        console.log(this.carts.length)
        console.log(this.carts)
        if (this.carts.length !== 0) {
            console.log(this.carts[this.carts.length - 1])
            id = this.carts[this.carts.length - 1].id + 1
        }
        return id
    };

    async grabarArchivo() {
        await fs.promises.writeFile(this.path, JSON.stringify(this.carts))
    };

    //Para poder setear el nombre del archivo desde afuera de la clase
    setPath(nombreArchivo) {
        this.path = nombreArchivo;
    };

    async getCart() {
        if (fs.existsSync(this.path)) {
            const carritos = await fs.promises.readFile(this.path, 'utf-8')
            const carritosJS = JSON.parse(carritos)
            this.carts = carritosJS
            return (this.carts)
        } else {
            return ('')
        }
    };

    async getCartById(id) {
        await this.getCart();
        console.log(this.carts[id])
        const encontrado = this.carts.find((carrito) => carrito.id === id);
        if (encontrado == undefined) {
            console.log(`Error: cart id ${id} cannot be found to retrieve.`);
            return ('');
        } else {
            return ({ encontrado }); // En formato objeto
        }
    };

    //
    async addCart(cid, pid) {
        await this.getCartById(cid);
        const cantidad = this.quantity + 1
        const producto = pid;
        const carrito = {
            id: this.#generarId(),
            product: [producto],
            quantity: cantidad
        };

        this.carts.push(carrito)
        await this.grabarArchivo()
    }

    async createCart() {
        await this.getCart();
        const carrito = {
            id: this.#generarId(),
            products: [],
            quantity: 0
        }
        this.carts.push(carrito)
        await this.grabarArchivo()
    }

};