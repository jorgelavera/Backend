import { Router } from 'express';
import CartManager from '../managers/cartManager.js';

const cartRouter = Router();

const carrito = new CartManager;
carrito.setPath('./carrito.json');

cartRouter.get('/', async (req, res) => {
    const cart = await carrito.getCartById(req.query)
    res.json({ message: 'Carrito encontrado', cart })
})


export default cartRouter;