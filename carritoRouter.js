const express = require('express');
const router = express.Router();
const { productManagerInstance } = require('./productManager');

// Importa la instancia de Carrito
const Carrito = require('./carrito');

// Crea una instancia de Carrito
const carrito = new Carrito();

// Ruta para crear un nuevo carrito
router.post('/', (req, res) => {
    const nuevoCarrito = carrito.crearCarrito(req.body.Products);
    res.status(201).json(nuevoCarrito);
});

router.get('/:cid', (req, res) => {
    const carritoID = parseInt(req.params.cid);

    // Busca el carrito por ID
    const carritoEncontrado = carrito.Carritos.find((c) => c.ID === carritoID);

    if (carritoEncontrado) {
        res.json(carritoEncontrado.Products);
    } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
    }
});

// Ruta para agregar productos a un carrito
router.post('/:cid/product/:pid', (req, res) => {
    const carritoID = parseInt(req.params.cid);
    const productoID = parseInt(req.params.pid);

    // Busca el carrito por ID
    const carritoEncontrado = carrito.Carritos.find((c) => c.ID === carritoID);

    if (carritoEncontrado) {
        const product = {
            product: productoID,
            quantity: 1,
        };

        // Verifica si el producto ya existe en el carrito
        const existingProduct = carritoEncontrado.Products.find((p) => p.product === productoID);

        if (existingProduct) {
            // Si ya existe, aumenta la cantidad en 1
            existingProduct.quantity += 1;
        } else {
            // Si no existe, agrega el producto al carrito
            carritoEncontrado.Products.push(product);
        }

        res.status(201).json(carritoEncontrado);
    } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
    }
//Ruta nueva de quinta entrega
const io = req.app.get('io'); // Obtiene el objeto Socket.io
io.emit('productoCambiado');

});


module.exports = router;
