// Realizar una clase “ProductManager” que gestione un conjunto de productos.
class ProductManager {
    constructor() {
        this.productos = []
    };

    //devuelve el arreglo con todos los productos creados hasta ese momento
    getProducts() {
        return (this.productos)
    };

    //agrega un producto al arreglo de productos inicial; Valida que no se repita el campo “code” y que todos los campos sean obligatorios
    //Al agregarlo, debe crearse con un id autoincrementable
    #evaluarProducto(codeProducto) {
        return this.productos.find((producto) => producto.code === codeProducto)
    }

    #generarCode() {
        let id = 1
        if (this.productos.length !== 0) {
            id = this.productos[this.productos.length - 1].id + 1
        }
        return id
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        const verifCode = this.#evaluarProducto(code)
        if (verifCode) {
            console.error(`Code ${code} is already in use, CANNOT be used again.`)
        } else {
            console.log(`Code ${code} is free, adding ok.`)
            const producto = {
                id: this.#generarCode(),
                title: title, description, price, thumbnail, code, stock,
            }
            //console.log(producto)
            this.productos.push(producto)
        }
    };


    //busca en el arreglo el producto que coincida con el id. En caso de no coincidir ningún id, mostrar en consola un error “Not found”
    getProductById(id) {
        const encontrado = this.productos.find((producto) => producto.id === id);
        if (encontrado == undefined) {
            console.log(`Error: id ${id} cannot be found.`);
            return ('');
        } else {
            return (encontrado);
        }
    };

};

// ----------------------------------------------------------------------------------------------------------------------
let product = new ProductManager;
console.log('First call to getProducts: ');
console.log(product.getProducts());
console.log('------------------------');

product.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25);

console.log('Second call to getProducts: ');
console.log(product.getProducts());
console.log('------------------------');

product.addProduct('segundo producto prueba', 'Este es OTRO producto prueba', 600.50, 'Sin imagen tampoco', 'abc124', 26);

console.log('Third call to getProducts: ');
console.log(product.getProducts());
console.log('------------------------');

product.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25);

console.log('************************');
console.log('call to getProductById 2: ');
console.log(product.getProductById(2));
console.log('------------------------');

console.log('call to getProductById inexistente: ');
console.log(product.getProductById(3));
console.log('------------------------');
