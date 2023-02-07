import fs from 'fs';

export default class ProductManager {
    constructor() {
        this.productos = []
        this.path = ''
    };

    #evaluarProducto(codeProducto) {
        return this.productos.find((producto) => producto.code === codeProducto)
    };
    //Al agregarlo, debe crearse con un id autoincrementable
    #generarId() {
        let id = 1
        if (this.productos.length !== 0) {
            id = this.productos[this.productos.length - 1].id + 1
        }
        return id
    };

    async grabarArchivo() {
        console.log('Productos grabados')
        await fs.promises.writeFile(this.path, JSON.stringify(this.productos))
    };

    //Para generar "codes" al azar
    generateCode() {
        const numero = Math.floor(Math.random() * 999) + 1;
        const newCode = 'ABC' + numero;
        return (newCode);
    };

    //Para poder setear el nombre del archivo desde afuera de la clase
    setPath(nombreArchivo) {
        this.path = nombreArchivo;
    };
    // ------------------------------------------------------------------------------------------

    //devuelve el arreglo con todos los productos creados hasta ese momento - leido desde el archivo; o la cantidad especificada en el paráemtro
    async getProducts(cantidad) {
        if (fs.existsSync(this.path)) {
            const productos = await fs.promises.readFile(this.path, 'utf-8')
            const productosJS = JSON.parse(productos)
            if (cantidad !== undefined) {
                if (cantidad.limit !== undefined) {
                    this.productos = productosJS.slice(0, cantidad.limit);
                    return (this.productos)
                }
            }
            this.productos = productosJS
            return (this.productos)
        } else {
            return ('')
        }
    };

    //agrega un producto al arreglo de productos inicial; Valida que no se repita el campo “code” y que todos los campos sean obligatorios
    async addProduct(title, description, code, price, status, stock, category, thumbnails) {
        console.log(title)
        const verifCode = this.#evaluarProducto(code)
        if (verifCode) {
            console.error(`Code ${code} is already in use, CANNOT be used again.`)
        } else {
            console.log(`Code ${code} is available, adding ok.`)
            const producto = {
                id: this.#generarId(),
                title, description, code, price, status, stock, category, thumbnails
            }
            //console.log(producto)
            this.productos.push(producto)
            await this.grabarArchivo()
            return (producto)
        }
    };

    // Lee el arreglo desde el archivo
    // Busca en el arreglo el producto que coincida con el id. 
    // En caso de no coincidir ningún id, mostrar en consola un error “Not found”
    async getProductById(id) {
        await this.getProducts();
        const encontrado = this.productos.find((producto) => producto.id === id);
        if (encontrado == undefined) {
            console.log(`Error: product id ${id} cannot be found to retrieve.`);
            return ('');
        } else {
            return ({ encontrado }); // En formato objeto
        }
    };

    //Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir.
    async deleteProduct(id) {
        await this.getProducts();
        const encontrado = this.productos.find((producto) => producto.id === id);
        if (encontrado == undefined || encontrado.id !== id) {
            console.log(`Error: id ${id} cannot be found to delete.`);
            return ('');
        } else {
            console.log(`Delete id ${id}`);
            const posicion = this.productos.findIndex((producto) => producto.id === id)
            this.productos.splice(posicion, 1)
            await this.grabarArchivo()
            return (encontrado);
        }
    }

    //Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, se evaluará que no se elimine el id y que sí se haya hecho la actualización.
    async updateProduct(id, title, description, code, price, status, stock, category, thumbnails) {
        await this.getProducts();
        const verifCode = this.#evaluarProducto(code)
        if (verifCode) {
            console.error(`Code ${code} is already in use, CANNOT update with this code.`)
        } else {
            const aModificar = this.getProductById(id);
            if (aModificar) {
                const producto = {
                    id, title, description, code, price, status, stock, category, thumbnails,
                }
                const posicion = this.productos.findIndex((producto) => producto.id === id)
                this.productos[posicion] = producto
                await this.grabarArchivo()
                return (producto);
            } else {
                console.error(`id ${id} does not exists, CANNOT update with this id.`)
            }
        }
    }
};
