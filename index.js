const { Console } = require('console');
const fs = require('fs');

// Realizar una clase “ProductManager” que gestione un conjunto de productos.
class ProductManager {
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

    grabarArchivo() {
        fs.writeFileSync(this.path, JSON.stringify(this.productos))
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

    //devuelve el arreglo con todos los productos creados hasta ese momento - leido desde el archivo
    getProducts() {
        if (fs.existsSync(this.path)) {
            const productos = fs.readFileSync(this.path, 'utf-8')
            const productosJS = JSON.parse(productos)
            this.productos = productosJS
            return (this.productos)
        } else {
            return ('')
        }
    };

    //agrega un producto al arreglo de productos inicial; Valida que no se repita el campo “code” y que todos los campos sean obligatorios
    addProduct(title, description, price, thumbnail, code, stock) {
        const verifCode = this.#evaluarProducto(code)
        if (verifCode) {
            console.error(`Code ${code} is already in use, CANNOT be used again.`)
        } else {
            console.log(`Code ${code} is available, adding ok.`)
            const producto = {
                id: this.#generarId(),
                title, description, price, thumbnail, code, stock,
            }
            //console.log(producto)
            this.productos.push(producto)
            this.grabarArchivo()
        }
    };

    //busca en el arreglo el producto que coincida con el id. En caso de no coincidir ningún id, mostrar en consola un error “Not found”
    getProductById(id) {
        const encontrado = this.productos.find((producto) => producto.id === id);
        if (encontrado == undefined) {
            console.log(`Error: id ${id} cannot be found to retrieve.`);
            return ('');
        } else {
            return ({ encontrado }); // En formato objeto
        }
    };

    //Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir.
    deleteProduct(id) {
        const encontrado = this.productos.find((producto) => producto.id === id);
        if (encontrado == undefined) {
            console.log(`Error: id ${id} cannot be found to delete.`);
            return ('');
        } else {
            console.log(`Delete id ${id}`);
            this.productos.splice(id - 1, 1)
            this.grabarArchivo()
            return (encontrado);
        }
    }

    //Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, se evaluará que no se elimine el id y que sí se haya hecho la actualización.
    updateProduct(id, title, description, price, thumbnail, code, stock) {
        const verifCode = this.#evaluarProducto(code)
        if (verifCode) {
            console.error(`Code ${code} is already in use, CANNOT update with this code.`)
        } else {
            const aModificar = this.getProductById(id);
            if (aModificar) {
                const producto = {
                    id, title, description, price, thumbnail, code, stock,
                }
                const posicion = this.productos.findIndex((producto) => producto.id === id)
                this.productos[posicion] = producto
                this.grabarArchivo()
            } else {
                console.error(`id ${id} does not exists, CANNOT update with this id.`)
            }
        }
    }
};

// ---------------------------------------------------------------------------------------------
let product = new ProductManager;
product.setPath('./productos.json');

// Trae lo que haya en el archivo
console.log('First call to getProducts: ');
console.table(product.getProducts());
console.log('------------------------');

// Agrega un nuevo producto al archivo
product.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25);

// Vuelve a traer todo lo del archivo
console.log('Second call to getProducts: ');
console.table(product.getProducts());
console.log('------------------------');

// Agrega otro producto al archivo. 
product.addProduct('segundo producto prueba', 'Este es OTRO producto prueba', 600.50, 'Sin imagen tampoco', product.generateCode(), 26);

// Vuelve a traer todo lo del archivo
console.log('Third call to getProducts: ');
console.table(product.getProducts());
console.log('------------------------');

// Muestra que no puede agregar pruductos con code repetido
product.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25);

// Trae el segundo producto
console.log('************************');
console.log('call to getProductById 2: ');
console.table(product.getProductById(2));
console.log('------------------------');

// Trae un producto inexistente
console.log('call to getProductById inexistente: ');
console.log(product.getProductById(5648789));
console.log('------------------------');

// BORRA el producto con índice 1, si existe.
console.log('call to deleteProduct 1: ');
console.log(product.deleteProduct(1));
console.log('------------------------');

// Vuelve a traer todo lo del archivo para verificar
console.log('Check with getProducts after delete: ');
console.table(product.getProducts());
console.log('------------------------');

//Modifica los datos del producto con índice 2, si existe.
product.updateProduct(2, 'producto modificado', 'Producto de prueba modificado', 666, 'Imagen?', product.generateCode(), 5.5);

// Vuelve a traer todo lo del archivo para verificar el update
console.log('Final with getProducts: ');
console.table(product.getProducts());
console.log('------------------------');

