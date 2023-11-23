const express = require('express');
const app = express();
const port = 8080;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const http = require('http');
const socketIO = require('socket.io');
const server = http.createServer(app);
const productManagerInstance = require('./productManager');
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });
const connectToDatabase = require('./config/database');
const carts = require('./models/carts');
const message = require('./models/message');
const product = require('./models/product');
const router = express.Router();
const productRouter = require('./router');
const carritoRouter = require('./carritoRouter');
const { MongoTopologyClosedError } = require('mongodb');
const path = require('path');


// Configurar Handlebars como motor de vistas
app.engine('handlebars', handlebars.engine({
  layoutsDir: path.join(__dirname, 'views/layouts'), // Directorio de layouts
  defaultLayout: 'main', // Establecer 'main' como diseño por defecto
  extname: 'handlebars' // Establecer la extensión de los archivos de vistas
}));
app.set('view engine', 'handlebars');

// Establecer la ubicación de las vistas
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.get('/', (req, res) => {
  res.render('home'); // Renderiza la vista 'home.handlebars' dentro de 'main.handlebars'
});


app.use('/api', router);

connectToDatabase();

const clients = new Set();

// Maneja conexiones WebSocket
wss.on('connection', (ws) => {
  clients.add(ws);
  if (clients.size === 1) {
    console.log('Cliente WebSocket conectado');
  }

  // Maneja el cierre de la conexión WebSocket
  ws.on('close', () => {
    clients.delete(ws);
    if (clients.size === 0) {
      console.log('Cliente WebSocket desconectado');
    }
  });
});

// Renderiza 'index.handlebars' en la ruta raíz '/'


// Renderiza 'main.handlebars' en la ruta '/main'
//app.get('/', (req, res) => {
//  res.render('main');
//});


app.use(express.static('public'));
app.use(bodyParser.json());

const io = socketIO(server);
io.on('connection', (socket) => {
  console.log('Cliente conectado');
  io.emit('productosActualizados', productManagerInstance.ObtenerProductos());
});

app.use('/api/products', productRouter);
app.use('/api/carts', carritoRouter);

/*app.get('/', (req, res) => {
  const productos = productManagerInstance.ObtenerProductos();
  res.render('home', { productos });
});
*/

/*
app.get('/home', (req, res) => {
  const productos = productManagerInstance.ObtenerProductos();
  res.render('home', { productos });
});
*/

app.get('/realtimeproducts', (req, res) => {
  const productos = productManagerInstance.ObtenerProductos();
  res.render('realTimeProducts', { productos });
});


server.listen(port, () => {
  console.log('Servidor en ejecución en el puerto 8080');
});
app.set('io', io);


//Contraseña: N7nYgWBBYk2hvi8

const URL = "mongodb+srv://tomas:N7nYgWBBYk2hvi8@cluster0.zy2qq6q.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Base de datos conectada');
  })
  .catch((error) => {
    console.error('Error en la conexión de la base de datos:', error);
  });

module.exports = app;