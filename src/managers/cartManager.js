import fs from 'fs';

export default class CartManager {
    constructor() {
        this.carts = []
        this.path = ''
    };

    //Al agregarlo, debe crearse con un id autoincrementable
    #generarId() {
        let id = 1
        if (this.carts.length !== 0) {
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
            if (carritos == '') {
                return ('')
            } else {
                const carritosJS = JSON.parse(carritos)
                this.carts = carritosJS
                return (this.carts)
            }
        } else {
            return ('')
        }
    };

    async getCartById(id) {
        await this.getCart();
        const encontrado = this.carts.find((carrito) => carrito.id === Number(id));
        if (encontrado == undefined) {
            console.log(`Error: cart id ${id} cannot be found to retrieve.`);
            return ('');
        } else {
            return ({ encontrado }); // En formato objeto
        }
    };

    async getIndexFromCart(id) {
        await this.getCart();
        const indexno = this.carts.findIndex((carrito) => carrito.id == Number(id));
        return (indexno);
    };

    async getIndexFromProduct(productArray, pid) {
        const indexnoProd = productArray.findIndex((prod) => prod.product == Number(pid));
        return (indexnoProd);
    };

    //
    async addCart(cid, pid) {
        const currentCart = await this.getCartById(cid);
        const indexno = await this.getIndexFromCart(cid);
        if (indexno !== -1) {
            const indexnoProd = await this.getIndexFromProduct(this.carts[indexno].products, pid);
            if (indexnoProd !== -1) {
                // update qty
                const productArray = this.carts[indexno].products
                const cantidad = this.carts[indexno].products[indexnoProd].quantity + 1;
                this.carts[indexno].products[indexnoProd].quantity = cantidad;
                await this.grabarArchivo()
            } else {
                // add
                if (currentCart == '') {
                    return ('')
                } else {
                    this.carts[indexno].products.push({ product: pid, quantity: 1 });
                    await this.grabarArchivo()
                }
            }
        };
    }

    async createCart() {
        await this.getCart();
        const carrito = {
            id: this.#generarId(),
            products: []
        }
        this.carts.push(carrito);
        await this.grabarArchivo();
        return (carrito.id);
    }

};