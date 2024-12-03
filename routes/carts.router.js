const express = require('express');
const { readCartsFromFile, writeCartsToFile, readProductsFromFile } = require('../helpers/fileSystem');

const router = express.Router();

// Obtener productos de un carrito
router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const carts = await readCartsFromFile();
        const cart = carts.find(c => c.id === cid);

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        res.json(cart.products);
    } catch (error) {
        console.error('Error al obtener productos del carrito:', error.message);
        res.status(500).json({ error: 'Error al obtener productos del carrito' });
    }
});

// Agregar producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const carts = await readCartsFromFile();
        const cart = carts.find(c => c.id === cid);

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const products = await readProductsFromFile();
        const product = products.find(p => p.id === pid);

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Buscar el producto en el carrito
        const productInCart = cart.products.find(p => p.product === pid);

        if (productInCart) {
            productInCart.quantity++;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await writeCartsToFile(carts);

        res.json({ message: 'Producto agregado al carrito', cart });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error.message);
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
});

// Eliminar producto del carrito
router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const carts = await readCartsFromFile();
        const cart = carts.find(c => c.id === cid);

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        // Filtrar para eliminar el producto
        const initialLength = cart.products.length;
        cart.products = cart.products.filter(p => p.product !== pid);

        if (cart.products.length === initialLength) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }

        await writeCartsToFile(carts);

        res.json({ message: 'Producto eliminado del carrito', cart });
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error.message);
        res.status(500).json({ error: 'Error al eliminar producto del carrito' });
    }
});

module.exports = router;
