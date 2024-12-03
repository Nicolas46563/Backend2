const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { engine } = require('express-handlebars');
const path = require('path');
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');
const { readProductsFromFile } = require('./helpers/fileSystem');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Configurar Handlebars
app.engine(
    'handlebars',
    engine({
        defaultLayout: 'main',
        layoutsDir: path.join(__dirname, 'views', 'layouts'),
        partialsDir: path.join(__dirname, 'views', 'partials'),
    })
);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// WebSocket para productos en tiempo real
io.on('connection', async (socket) => {
    console.log('Cliente conectado');
    try {
        const products = await readProductsFromFile();
        socket.emit('updateProducts', products);

        socket.on('productUpdated', async () => {
            const updatedProducts = await readProductsFromFile();
            io.emit('updateProducts', updatedProducts);
        });
    } catch (error) {
        console.error('Error en WebSocket:', error.message);
    }
});

// Servidor
const PORT = 8580;
httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
