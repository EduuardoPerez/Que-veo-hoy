//paquetes necesarios para el proyecto
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const controlador = require('./controladores/controlador')


const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

//rutas
app.get('/peliculas', controlador.obtenerPeliculas);
app.get('/peliculas/recomendacion', controlador.obtenerRecomendacion);
app.get('/peliculas/:id', controlador.obtenerInfoPelicula);
app.get('/generos', controlador.obtenerGeneros);

//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
const puerto = '8080';

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});

