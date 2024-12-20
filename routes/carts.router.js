const express = require('express');
const {
    createCart,
    getCartById,
    addProductToCart,
    removeProductFromCart, // Asegúrate de que esté definido
    confirmCart,
    addMultipleProductsToCart,
    getConfirmedCarts
} = require('../controllers/carts.controller');

const router = express.Router();

// Crear un nuevo carrito
router.post('/', createCart);

// Agregar productos en masa al carrito
router.post('/:id/products/bulk', addMultipleProductsToCart);

// Agregar un producto individual al carrito
router.post('/:id/products', addProductToCart);

// Eliminar un producto del carrito
router.delete('/:id/products/:productId', removeProductFromCart);

// Confirmar un carrito
router.post('/:id/confirm', confirmCart);

// Ruta para obtener los últimos carritos confirmados
router.get('/confirmed', getConfirmedCarts);

// Obtener un carrito por ID
router.get('/:id', getCartById);

module.exports = router;
