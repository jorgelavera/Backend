// Correr como 
// node src/app.js
//
import ProductManager from './productManager.js';
import express from 'express';

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const product = new ProductManager;
product.setPath('./productos.json');

// Probar con http://localhost:8080/products?limit=2
app.get('/products', async (req, res) => {
    const productos = await product.getProducts(req.query)
    res.json({ message: 'Productos encontrados', productos })
})

// Probar con http://localhost:8080/products/4
app.get('/products/:pid', async (req, res) => {
    const { pid } = req.params
    const producto = await product.getProductById(parseInt(pid))
    if (producto) {
        res.json({ message: 'Producto encontrado', producto })
    } else {
        res.status(400).send('El producto no existe')
    }
})

app.listen(8080, () => {
    console.log('Servidor escuchando en localhost:8080...')
})