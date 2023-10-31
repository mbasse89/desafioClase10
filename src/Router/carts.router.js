import { Router } from "express";
import { CartManager } from "../ProductManager/CartManager.js";

const router = Router();
const cartManager = new CartManager();

// Ruta para obtener una lista de carritos
router.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        res.send(carts);
    } catch (err) {
        res.status(500).send("Error al obtener los carritos: " + err);
    }
});

// Ruta para obtener un carrito específico por ID
router.get('/:cid', async (req, res) => {
    const id = parseInt(req.params.cid);
    const cart = await cartManager.getCartById(id);
    res.send(cart);
});

// Ruta para crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        // Llamar al método 'createCart' del gestor de carritos para crear un nuevo carrito
        const cart = await cartManager.createCart();
        res.send(cart);
    } catch (err) {
        res.status(500).send("Error al crear el carrito: " + err);
    }
});

// Ruta para agregar un producto a un carrito específico
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        // Obtener los IDs del carrito y del producto desde los parámetros de la URL
        const cid = parseInt(req.params.cid);
        const pid = parseInt(req.params.pid);
        const product = await cartManager.addProductInCart(cid, pid);
        res.send(product);
    } catch (err) {
        res.status(500).send("Error al agregar producto al carrito: " + err);
    }
});

export default router;
