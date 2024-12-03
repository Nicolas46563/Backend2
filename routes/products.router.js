const express = require('express');
const multer = require('multer');
const path = require('path');
const { readProductsFromFile, writeProductsToFile } = require('../helpers/fileSystem');

// Configuración de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

const router = express.Router();

// Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const products = await readProductsFromFile();
        res.json(products);
    } catch (error) {
        console.error('Error al obtener productos:', error.message);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// Crear un nuevo producto con imagen adjunta
router.post('/', upload.single('image'), async (req, res) => {
    const { title, description, price, stock, category } = req.body;

    if (!title || !description || typeof price !== 'number' || typeof stock !== 'number' || !category) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios y deben ser válidos' });
    }

    try {
        const products = await readProductsFromFile();
        const newProduct = {
            id: `prod_${Date.now()}`,
            title,
            description,
            price: Number(price),
            stock: Number(stock),
            category,
            thumbnails: req.file ? [`/images/${req.file.filename}`] : ['/images/default.jpg'] // Ruta de la imagen
        };

        products.push(newProduct);
        await writeProductsToFile(products);
        res.status(201).json({ message: 'Producto creado exitosamente', product: newProduct });
    } catch (error) {
        console.error('Error al crear producto:', error.message);
        res.status(500).json({ error: 'Error al crear el producto' });
    }
});

// Eliminar un producto
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const products = await readProductsFromFile();
        const productIndex = products.findIndex(p => p.id === id);

        if (productIndex === -1) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        products.splice(productIndex, 1);
        await writeProductsToFile(products);

        res.json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar producto:', error.message);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

module.exports = router;
