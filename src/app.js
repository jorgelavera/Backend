import ProductManager from './productManager.js';
import CartManager from './cartManager.js';
import express from 'express';

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const product = new ProductManager;
product.setPath('./productos.json');
const carrito = new CartManager;
carrito.setPath('./carrito.json');

// Probar con http://localhost:8080/products?limit=2
app.get('/api/products', async (req, res) => {
    const productos = await product.getProducts(req.query)
    res.json({ message: 'Productos encontrados', productos })
})

// Probar con http://localhost:8080/products/4
app.get('/api/products/:pid', async (req, res) => {
    const { pid } = req.params
    const producto = await product.getProductById(parseInt(pid))
    if (producto) {
        res.json({ message: 'Producto encontrado', producto })
    } else {
        res.status(400).send('El producto no existe')
    }
})

app.delete('/api/products/:pid', async (req, res) => {
    const { pid } = req.params
    const producto = await product.deleteProduct(parseInt(pid))
    if (producto) {
        res.json({ message: 'Producto eliminado', producto })
    } else {
        res.status(400).send('El producto no existe')
    }
})

app.post('/api/products', async (req, res) => {
    //addProduct(title, description, price, thumbnail, code, stock)
    //const { pid } = req.params
    const producto = await product.addProduct(parseInt(pid))
    if (producto) {
        res.json({ message: 'Producto agregado', producto })
    } else {
        res.status(400).send('Error ?')
    }
})

app.listen(8080, () => {
    console.log('Servidor escuchando en localhost:8080...')
})