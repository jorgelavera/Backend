import { Router } from 'express';
import CartManager from '../managers/cartManager.js';
import ProductManager from '../managers/productManager.js';

const cartRouter = Router();

const product = new ProductManager;
product.setPath('./productos.json');

const carrito = new CartManager;
carrito.setPath('./carrito.json');

cartRouter.get('/:pid', async (req, res) => {
    const { pid } = req.params
    const cart = await carrito.getCartById(parseInt(pid))
    res.json({ message: 'Carrito encontrado', cart })
})

cartRouter.post('/', async (req, res) => {
    const cart = await carrito.createCart()
    if (cart) {
        res.json({ message: 'Carrito creado', cart })
    } else {
        res.status(400).send('Error ?')
    }
})

cartRouter.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params
    const cart = await carrito.addCart(cid, pid)
    if (cart) {
        res.json({ message: 'Producto agregado a Carrito', cart })
    } else {
        res.status(400).send('Error ?')
    }
})

export default cartRouter;