const express = require('express');
const { readProductsFromFile, writeProductsToFile } = require('../helpers/fileSystem');

// Inicializar el router
const productsRouter = express.Router();

// Rutas de productos
productsRouter.get('/', async (req, res) => {
    try {
        const products = await readProductsFromFile();
        const limit = parseInt(req.query.limit, 10);

        if (limit && limit > 0) {
            return res.json(products.slice(0, limit));
        }
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

productsRouter.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const products = await readProductsFromFile();
        const product = products.find(prod => prod.id === pid);

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

productsRouter.post('/', async (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios, excepto thumbnails' });
    }

    try {
        const products = await readProductsFromFile();
        const id = `prod_${Date.now()}`;

        const newProduct = {
            id,
            title,
            description,
            code,
            price,
            status: true,
            stock,
            category,
            thumbnails: thumbnails || [],
        };

        products.push(newProduct);
        await writeProductsToFile(products);

        res.status(201).json({ message: 'Producto creado', product: newProduct });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el producto' });
    }
});

productsRouter.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const updatedFields = req.body;

    try {
        const products = await readProductsFromFile();
        const productIndex = products.findIndex(product => product.id === pid);

        if (productIndex === -1) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        delete updatedFields.id;
        products[productIndex] = { ...products[productIndex], ...updatedFields };

        await writeProductsToFile(products);
        res.json({ message: 'Producto actualizado', product: products[productIndex] });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

productsRouter.delete('/:pid', async (req, res) => {
    const { pid } = req.params;

    try {
        const products = await readProductsFromFile();
        const productIndex = products.findIndex(product => product.id === pid);

        if (productIndex === -1) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        products.splice(productIndex, 1);
        await writeProductsToFile(products);

        res.json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

// Exportar el router
module.exports = productsRouter;
