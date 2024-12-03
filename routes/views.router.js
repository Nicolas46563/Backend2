const express = require('express');
const router = express.Router();
const { readProductsFromFile, readCartsFromFile } = require('../helpers/fileSystem');

// Página principal
router.get('/', async (req, res) => {
    try {
        const products = await readProductsFromFile();
        res.render('home', { products });
    } catch (error) {
        console.error('Error al cargar la página de inicio:', error.message);
        res.status(500).send('Error al cargar la página de inicio.');
    }
});

// Gestión de productos
router.get('/products', async (req, res) => {
    try {
        const products = await readProductsFromFile();
        res.render('products', { products });
    } catch (error) {
        console.error('Error al cargar la gestión de productos:', error.message);
        res.status(500).send('Error al cargar la página de gestión de productos.');
    }
});

// Productos en tiempo real
router.get('/realtimeproducts', async (req, res) => {
    try {
        res.render('realTimeProducts'); // Renderiza la vista para productos en tiempo real
    } catch (error) {
        console.error('Error al cargar productos en tiempo real:', error.message);
        res.status(500).send('Error al cargar la página de productos en tiempo real.');
    }
});

// Carrito específico
router.get('/cart/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const carts = await readCartsFromFile();
        const cart = carts.find(cart => cart.id === cid);

        if (!cart) {
            return res.status(404).send('Carrito no encontrado.');
        }

        res.render('cart', { cartId: cid, products: cart.products });
    } catch (error) {
        console.error('Error al cargar el carrito:', error.message);
        res.status(500).send('Error al cargar el carrito.');
    }
});

module.exports = router;
