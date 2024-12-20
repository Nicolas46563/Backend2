const express = require('express');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const router = express.Router();

// Página principal
router.get('/', async (req, res) => {
    try {
        // Obtener todos los productos desde MongoDB
        const products = await Product.find({});
        res.render('home', { products }); // Pasar productos a la vista
    } catch (error) {
        console.error('Error al cargar los productos:', error.message);
        res.status(500).send('Error al cargar los productos.');
    }
});

// Gestión de productos
router.get('/products', async (req, res) => {
    const products = await Product.find();
    res.render('products', { title: 'Gestión de Productos', products });
});

// Productos en tiempo real
router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { title: 'Productos en Tiempo Real' });
});

module.exports = router;
