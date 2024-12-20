const Product = require('../models/Product');
const Joi = require('joi');

// Esquema de validación para productos
const productSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().positive().required(),
    stock: Joi.number().integer().min(0).required(),
    category: Joi.string().required(),
    thumbnails: Joi.array().items(
        Joi.string().pattern(/^\/images\/[a-zA-Z0-9-_]+\.(jpg|jpeg|png)$/).required()
    ).min(1).required()
});

// Obtener todos los productos con filtros, paginación y ordenamiento
exports.getAllProducts = async (req, res) => {
    const limit = Math.max(Number(req.query.limit) || 10, 1); // Límite mínimo 1
    const page = Math.max(Number(req.query.page) || 1, 1); // Página mínima 1
    const sort = req.query.sort && ['price', 'name', 'createdAt'].includes(req.query.sort) ? req.query.sort : null;
    const order = req.query.order === 'desc' ? -1 : 1;
    const category = req.query.category;
    const price = req.query.price ? Number(req.query.price) : null;

    // Construcción de consulta
    const query = {};
    if (category) query.category = category;
    if (price && !isNaN(price)) query.price = { $lte: price };

    try {
        // Consulta de productos
        const products = await Product.find(query)
            .select('title price thumbnails category') // Proyección
            .limit(limit)
            .skip((page - 1) * limit)
            .sort(sort ? { [sort]: order } : {});

        const totalProducts = await Product.countDocuments(query);

        // Respuesta con datos completos de paginación
        res.json({
            products,
            totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: page,
            hasNextPage: page < Math.ceil(totalProducts / limit),
            hasPrevPage: page > 1
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos', details: error.message });
    }
};

// Crear un nuevo producto
exports.createProduct = async (req, res) => {
    try {
        const { error, value } = productSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: 'Datos inválidos', details: error.details });
        }

        const newProduct = new Product(value);
        const savedProduct = await newProduct.save();

        res.status(201).json({ message: 'Producto creado exitosamente', product: savedProduct });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el producto', details: error.message });
    }
};

// Crear productos en masa
exports.bulkCreateProducts = async (req, res) => {
    try {
        const { products } = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: 'Debe proporcionar un array de productos válido' });
        }

        const validationResults = products.map(product => productSchema.validate(product));
        const errors = validationResults.filter(result => result.error);

        if (errors.length > 0) {
            return res.status(400).json({
                error: 'Algunos productos son inválidos',
                details: errors.map(e => e.error.details)
            });
        }

        const newProducts = await Product.insertMany(products);
        res.status(201).json({ message: 'Productos creados exitosamente', products: newProducts });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear productos en masa', details: error.message });
    }
};

// Actualizar un producto por ID
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { error, value } = productSchema.validate(req.body);

        if (error) {
            return res.status(400).json({ error: 'Datos inválidos', details: error.details });
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, value, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json({ message: 'Producto actualizado exitosamente', product: updatedProduct });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto', details: error.message });
    }
};

// Eliminar un producto por ID
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto', details: error.message });
    }
};
