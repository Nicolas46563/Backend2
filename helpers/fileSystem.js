const fs = require('fs').promises;
const path = require('path');

// Define rutas absolutas para los archivos JSON
const basePath = path.resolve(__dirname, '../data'); // Ruta absoluta a la carpeta 'data'
const productsPath = path.join(basePath, 'products.json');
const cartsPath = path.join(basePath, 'carts.json');

// Función genérica para leer un archivo JSON
const readFromFile = async (filePath) => {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        const parsedData = JSON.parse(data);

        if (!Array.isArray(parsedData)) {
            throw new Error(`El archivo ${filePath} no contiene un arreglo válido.`);
        }

        return parsedData;
    } catch (error) {
        console.error(`Error leyendo desde ${filePath}:`, error.message);
        return [];
    }
};

// Función genérica para escribir en un archivo JSON
const writeToFile = async (filePath, data) => {
    try {
        console.log(`Intentando escribir en: ${filePath}`);
        if (!Array.isArray(data)) {
            throw new Error(`El argumento para ${filePath} debe ser un arreglo.`);
        }

        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        console.log(`Escritura exitosa en: ${filePath}`);
    } catch (error) {
        console.error(`Error escribiendo en ${filePath}:`, error.message);
    }
};

// Función para verificar y crear archivos si no existen
const ensureFileExists = async (filePath, initialData = []) => {
    try {
        await fs.access(filePath); // Verifica si el archivo existe
    } catch {
        try {
            console.warn(`Archivo no encontrado. Creando: ${filePath}`);
            await fs.writeFile(filePath, JSON.stringify(initialData, null, 2));
        } catch (error) {
            console.error(`Error creando el archivo ${filePath}:`, error.message);
        }
    }
};

// Inicializar los archivos si no existen
(async () => {
    await ensureFileExists(productsPath, []); // Inicializa 'products.json' si no existe
    await ensureFileExists(cartsPath, []);   // Inicializa 'carts.json' si no existe
})();

// Funciones específicas para productos y carritos
const readProductsFromFile = async () => await readFromFile(productsPath);
const writeProductsToFile = async (products) => await writeToFile(productsPath, products);
const readCartsFromFile = async () => await readFromFile(cartsPath);
const writeCartsToFile = async (carts) => await writeToFile(cartsPath, carts);

module.exports = { 
    readProductsFromFile, 
    writeProductsToFile, 
    readCartsFromFile, 
    writeCartsToFile, 
    productsPath, 
    cartsPath 
};
