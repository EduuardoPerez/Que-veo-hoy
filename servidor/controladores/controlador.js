const conn = require('../lib/conexionbd')

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

module.exports = {
  obtenerPeliculas: obtenerPeliculas
};