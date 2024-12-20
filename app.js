const express = require('express');
const mongoose = require('mongoose');
const { create } = require('express-handlebars');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');
require('dotenv').config();

// Rutas
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');

const app = express();

// Configuración de Handlebars con un helper para acceder a índices
const hbs = create({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials'),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true, // Permite propiedades heredadas
        allowProtoMethodsByDefault: true,   // Permite métodos heredados (opcional)
    },
    helpers: {
        getIndex: (array, index) => (Array.isArray(array) ? array[index] : ''), // Helper para obtener índices de arrays
    },
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Documentación de APIs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Conectado a MongoDB Atlas'))
    .catch(err => {
        console.error('Error al conectar a MongoDB:', err.message);
        process.exit(1);
    });

// Rutas de API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Rutas de vistas
app.use('/', viewsRouter);

// Manejo de Rutas No Encontradas
app.use((req, res) => {
    res.status(404).render('404', { title: 'Página no encontrada' });
});

// Iniciar servidor
const PORT = process.env.PORT || 8580;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
