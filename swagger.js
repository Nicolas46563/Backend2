const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'E-commerce API',
            version: '1.0.0',
            description: 'API para gestionar productos y carritos en un e-commerce.',
        },
        servers: [
            {
                url: 'http://localhost:8580',
                description: 'Servidor local',
            },
        ],
    },
    apis: ['./routes/*.js'], // Rutas donde buscar anotaciones de Swagger
};

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtener productos
 *     description: Devuelve una lista de productos con opciones de filtro, paginación y ordenamiento.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Número de productos por página.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Página actual.
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Campo por el cual ordenar los productos.
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrar productos por categoría.
 *       - in: query
 *         name: price
 *         schema:
 *           type: number
 *         description: Filtrar productos por precio máximo.
 *     responses:
 *       200:
 *         description: Lista de productos.
 *       500:
 *         description: Error al obtener los productos.
 *
 *   post:
 *     summary: Crear un producto
 *     description: Crea un nuevo producto en la base de datos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Nombre del producto.
 *               description:
 *                 type: string
 *                 description: Descripción del producto.
 *               price:
 *                 type: number
 *                 description: Precio del producto.
 *               stock:
 *                 type: integer
 *                 description: Cantidad disponible en stock.
 *               category:
 *                 type: string
 *                 description: Categoría del producto.
 *               thumbnails:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: URLs de las imágenes del producto.
 *     responses:
 *       201:
 *         description: Producto creado exitosamente.
 *       400:
 *         description: Error de validación.
 *       500:
 *         description: Error al crear el producto.
 *
 * /api/products/bulk:
 *   post:
 *     summary: Crear productos en masa
 *     description: Crea múltiples productos en una sola solicitud.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                 description: Lista de productos a crear.
 *     responses:
 *       201:
 *         description: Productos creados exitosamente.
 *       400:
 *         description: Error de validación.
 *       500:
 *         description: Error al crear los productos en masa.
 *
 * /api/products/{id}:
 *   put:
 *     summary: Actualizar un producto
 *     description: Actualiza un producto existente por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               category:
 *                 type: string
 *               thumbnails:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente.
 *       400:
 *         description: Error de validación.
 *       404:
 *         description: Producto no encontrado.
 *       500:
 *         description: Error al actualizar el producto.
 *
 *   delete:
 *     summary: Eliminar un producto
 *     description: Elimina un producto existente por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto.
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente.
 *       404:
 *         description: Producto no encontrado.
 *       500:
 *         description: Error al eliminar el producto.
 */

const swaggerSpecs = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpecs;
