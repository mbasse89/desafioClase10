import { Router } from "express";
import ProductManager from '../ProductManager/ProductManager.js';
import { uploader } from '../utils.js';

const router = Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    const limit = req.query.limit;
    const products = await productManager.getProducts();

    if (limit) {
        const limitedProducts = products.slice(0, limit);
        res.status(206).json(limitedProducts);
    } else {
        return res.status(200).json({ products: products });
    }
});

router.get('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    const producto = await productManager.getProductsById(productId); // Corregido

    if (!producto) return res.status(404).json({ error: `El producto con el id ${productId} no se encuentra` });

    return res.status(200).json({ producto: producto });
});

router.post('/', async (req, res) => {
    try {
        let {
            title,
            description,
            price,
            thumbnail,
            code,
            category,
            stock,
            status,
        } = req.body;

        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const productoAgregado = await productManager.addProduct(
            title,
            description,
            price,
            thumbnail,
            code,
            category,
            stock,
            (status = true)
        );

        if (productoAgregado) {
            const productos = await productManager.getProducts();

            req.app.get('socketio').emit('productosActualizados', productos);
            return res.status(201).json({ mensaje: `Producto con el id ${productoAgregado.id} agregado exitosamente`, producto: productoAgregado });
        }
        return res.status(404).json({ error: 'Error al agregar el producto' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const productos = await productManager.getProducts();

        if (req.body.id !== productId && req.body.id !== undefined) {
            return res.status(404).json({ error: 'No es posible identificar el producto con el Id proporcionado' });
        }

        const actualizado = req.body;
        const productoEncontrado = productos.find(item => item.id === productId); // Corregido

        if (!productoEncontrado) {
            return res.status(404).json({ error: `El producto con el id ${productId} no existe` });
        }

        await productManager.updateProduct(productId, actualizado);
        const productosActualizados = await productManager.getProducts();

        req.app.get('socketio').emit('productosActualizados', productosActualizados);
        res.status(200).json({ mensaje: `Actualización exitosa del producto con el id ${productId}` });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const productos = await productManager.getProducts();
        const productoEncontrado = productos.find(item => item.id === productId); // Corregido

        if (!productoEncontrado) {
            return res.status(404).json({ error: `El producto con el id ${productId} no existe` });
        }

        const productoEliminado = await productManager.deleteProduct(productId);
        console.log(productoEliminado);

        const productosActualizados = await productManager.getProducts();

        req.app.get('socketio').emit('productosActualizados', productosActualizados);
        res.status(200).json({ mensaje: `Producto con el id ${productId} eliminado exitosamente`, productos: await productManager.getProducts() });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
});

export default router;

