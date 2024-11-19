const fs = require('fs').promises;

const readProductsFromFile = async () => {
    const data = await fs.readFile('./data/products.json', 'utf-8');
    return JSON.parse(data);
};

const writeProductsToFile = async (products) => {
    await fs.writeFile('./data/products.json', JSON.stringify(products, null, 2));
};

const readCartsFromFile = async () => {
    const data = await fs.readFile('./data/carts.json', 'utf-8');
    return JSON.parse(data);
};

const writeCartsToFile = async (carts) => {
    await fs.writeFile('./data/carts.json', JSON.stringify(carts, null, 2));
};

module.exports = { readProductsFromFile, writeProductsToFile, readCartsFromFile, writeCartsToFile };
