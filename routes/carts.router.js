const express = require('express');
const { readCartsFromFile, writeCartsToFile, readProductsFromFile } = require('../helpers/fileSystem');

// Inicializar el router
const cartsRouter = express.Router();

// Crear un carrito
cartsRouter.post('/', async (req, res) => {
    try {
        const carts = await readCartsFromFile();
        const id = `cart_${Date.now()}`;
        const newCart = { id, products: [] };

        carts.push(newCart);
        await writeCartsToFile(carts);

        res.status(201).json({ message: 'Carrito creado', cart: newCart });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

// Obtener productos de un carrito
cartsRouter.get('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const carts = await readCartsFromFile();
        const cart = carts.find(cart => cart.id === cid);

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        res.json(cart.products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos del carrito' });
    }
});

// Agregar producto a un carrito
cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const carts = await readCartsFromFile();
        const cart = carts.find(cart => cart.id === cid);

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const products = await readProductsFromFile();
        const productExists = products.find(product => product.id === pid);

        if (!productExists) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const productInCart = cart.products.find(product => product.product === pid);

        if (productInCart) {
            productInCart.quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await writeCartsToFile(carts);

        res.json({ message: 'Producto agregado al carrito', cart });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
});

// Ruta para obtener todos los carritos
cartsRouter.get('/', async (req, res) => {
    try {
        const carts = await readCartsFromFile();
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json({ error: 'Hubo un problema al obtener los carritos' });
    }
});

// Exportar el router
module.exports = cartsRouter;

