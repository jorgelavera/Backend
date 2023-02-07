import { Router } from 'express';
import ProductManager from '../managers/productManager.js';

const productRouter = Router();

const product = new ProductManager;
product.setPath('./productos.json');

// Probar con http://localhost:8080/products?limit=2
productRouter.get('/', async (req, res) => {
    const productos = await product.getProducts(req.query)
    res.json({ message: 'Productos encontrados', productos })
})

// Probar con http://localhost:8080/products/4
productRouter.get('/:pid', async (req, res) => {
    const { pid } = req.params
    const producto = await product.getProductById(parseInt(pid))
    if (producto) {
        res.json({ message: 'Producto encontrado', producto })
    } else {
        res.status(400).send('El producto no existe')
    }
})

productRouter.delete('/:pid', async (req, res) => {
    const { pid } = req.params
    const producto = await product.deleteProduct(parseInt(pid))
    if (producto) {
        res.json({ message: 'Producto eliminado', producto })
    } else {
        res.status(400).send('El producto no existe')
    }
})

productRouter.post('/', async (req, res) => {
    let product = req.body;
    //addProduct(title, description, price, thumbnail, code, stock)
    //const { pid } = req.params
    const producto = await product.addProduct(product.title,)
    if (producto) {
        res.json({ message: 'Producto agregado', producto })
    } else {
        res.status(400).send('Error ?')
    }
})

export default productRouter;