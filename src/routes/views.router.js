import { Router } from "express";
import ProductManager from '../managers/productManager.js';

const product = new ProductManager;
product.setPath('./productos.json');

const viewsRoute = Router();

viewsRoute.get("/", (req, res) => {
    res.render("home", { product })
})

viewsRoute.get("/realtimeproducts", (req, res) => {
    res.render("products", { product })
})

export default viewsRoute