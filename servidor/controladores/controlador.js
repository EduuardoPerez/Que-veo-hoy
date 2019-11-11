const conn = require('../lib/conexionbd')

// Se obtienen todas las peliculas de la BBDD
const obtenerPeliculas = (req, res) => {
  const sql = `select * from pelicula;`;

  conn.query(sql, (error, resultado, campos) => {
    if(error){
      console.log('Hubo un error en la consulta', error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }
    const response = {
      'peliculas': resultado
    }
    res.send(JSON.stringify(response));
  });
};

// Se obtienen todos los generos de las peliculas
const obtenerGeneros = (req, res) => {
  const sql = `select * from genero;`;

  conn.query(sql, (error, resultado, campos) => {
    if(error){
      console.log('Hubo un error en la consulta', error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }
    const response = {
      'generos': resultado
    }
    res.send(JSON.stringify(response));
  });
}

module.exports = {
  obtenerPeliculas: obtenerPeliculas,
  obtenerGeneros: obtenerGeneros
};