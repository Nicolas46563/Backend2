const Cart = require('../models/Cart');
const Product = require('../models/Product');
const mongoose = require('mongoose'); // Importa mongoose
const Joi = require('joi');

// Esquema para validar un solo producto dentro del carrito
const productInCartSchema = Joi.object({
    productId: Joi.string().required().messages({
        'string.empty': '"productId" no puede estar vacío',
        'any.required': '"productId" es obligatorio',
    }),
    quantity: Joi.number().integer().min(1).required().messages({
        'number.base': '"quantity" debe ser un número',
        'number.min': '"quantity" debe ser al menos 1',
        'any.required': '"quantity" es obligatorio',
    }),
});

// Crear un nuevo carrito
exports.createCart = async (req, res) => {
    try {
        const { products } = req.body;

        // Validar que el carrito no esté vacío
        if (!products || products.length === 0) {
            return res.status(400).json({ error: 'No se puede crear un carrito vacío' });
        }

        // Validar cada producto
        for (const p of products) {
            if (!p.product || !mongoose.Types.ObjectId.isValid(p.product)) {
                return res.status(400).json({ error: 'Formato de producto inválido. Debe ser un ObjectId válido.' });
            }
            if (!p.quantity || p.quantity < 1) {
                return res.status(400).json({ error: 'Cantidad inválida. Debe ser mayor o igual a 1.' });
            }
        }

        const newCart = new Cart({ products });
        const savedCart = await newCart.save();
        res.status(201).json({ message: 'Carrito creado exitosamente', cart: savedCart });
    } catch (error) {
        console.error('Error al crear el carrito:', error.message);
        res.status(500).json({ error: 'Error al crear el carrito', details: error.message });
    }
};

// Obtener un carrito por ID
exports.getCartById = async (req, res) => {
    try {
        const { id } = req.params;
        const cart = await Cart.findById(id).populate('products.product');

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el carrito', details: error.message });
    }
};

// Agregar un producto al carrito
exports.addProductToCart = async (req, res) => {
    try {
        const { id } = req.params;
        const { error, value } = productInCartSchema.validate(req.body);

        if (error) {
            return res.status(400).json({ error: 'Datos inválidos', details: error.details });
        }

        const cart = await Cart.findById(id);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const product = await Product.findById(value.productId);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const productInCart = cart.products.find(p => p.product.equals(value.productId));
        if (productInCart) {
            productInCart.quantity += value.quantity;
        } else {
            cart.products.push({ product: value.productId, quantity: value.quantity });
        }

        const updatedCart = await cart.save();
        res.json({ message: 'Producto agregado al carrito', cart: updatedCart });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar producto al carrito', details: error.message });
    }
};

// Agregar productos en masa al carrito con un JSON estructurado
exports.addMultipleProductsToCart = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, products } = req.body;

        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({
                error: 'Debe proporcionar un arreglo de productos válido'
            });
        }

        const cart = await Cart.findById(id);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        for (const { productId, quantity } of products) {
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ error: `Producto no encontrado: ${productId}` });
            }

            const productInCart = cart.products.find(p => p.product.equals(productId));
            if (productInCart) {
                productInCart.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }
        }

        const updatedCart = await cart.save();
        res.json({
            message: `Productos de la lista "${title}" agregados al carrito`,
            cart: updatedCart
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al agregar productos al carrito',
            details: error.message
        });
    }
};

// Confirmar un carrito
exports.confirmCart = async (req, res) => {
    try {
        const { id } = req.params;
        const cart = await Cart.findById(id).populate('products.product');

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        res.json({ message: 'Carrito confirmado', cart });
    } catch (error) {
        res.status(500).json({ error: 'Error al confirmar el carrito', details: error.message });
    }
};

// Obtener los últimos carritos confirmados
exports.getConfirmedCarts = async (req, res) => {
    try {
        const carts = await Cart.find({})
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('products.product');

        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los carritos confirmados', details: error.message });
    }
};

exports.removeProductFromCart = async (req, res) => {
    try {
        const { id, productId } = req.params;
        const cart = await Cart.findById(id);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const initialLength = cart.products.length;
        cart.products = cart.products.filter(p => !p.product.equals(productId));

        if (cart.products.length === initialLength) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }

        const updatedCart = await cart.save();
        res.json({ message: 'Producto eliminado del carrito', cart: updatedCart });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar producto del carrito', details: error.message });
    }
};

// Confirmar un carrito
exports.confirmCart = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar el carrito por ID y poblar los productos
        const cart = await Cart.findById(id).populate('products.product');
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        // Validar que el carrito tenga productos
        if (cart.products.length === 0) {
            return res.status(400).json({ error: 'El carrito está vacío y no se puede confirmar' });
        }

        cart.confirmed = true;
        await cart.save();

        res.json({ message: 'Carrito confirmado con éxito', cart });
    } catch (error) {
        console.error('Error al confirmar el carrito:', error.message);
        res.status(500).json({ error: 'Error al confirmar el carrito', details: error.message });
    }
};
