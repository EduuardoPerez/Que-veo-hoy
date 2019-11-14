const conn = require('../lib/conexionbd')

// Crea la query según los parametros que reciba
const crearQuery = (seleccionUsuario) => {
  const pagina = seleccionUsuario.pagina;
  const cantidad = seleccionUsuario.cantidad;
  const columna_orden = seleccionUsuario.columna_orden;
  const titulo = seleccionUsuario.titulo;
  const tipo_orden = seleccionUsuario.tipo_orden;
  const genero = seleccionUsuario.genero;
  const anio = seleccionUsuario.anio;
  const regNro = (pagina*cantidad-cantidad)+1;

  if(!titulo && !genero && !anio){
    return `select * from pelicula order by ${columna_orden} ${tipo_orden} limit ${regNro},${cantidad};`
  }
  if(!titulo && genero && !anio){
    return `select * from pelicula where genero_id = ${genero} order by ${columna_orden} ${tipo_orden} limit ${regNro},${cantidad};`
  }
  if(!titulo && !genero && anio){
    return `select * from pelicula where anio = ${anio} order by ${columna_orden} ${tipo_orden} limit ${regNro},${cantidad};`
  }
  if(!titulo && genero && anio){
    return `select * from pelicula where genero_id = ${genero} and anio = ${anio} order by ${columna_orden} ${tipo_orden} limit ${regNro},${cantidad};`
  }
  if(titulo && !genero && !anio){
    return `select * from pelicula where titulo like '%${titulo}%' order by ${columna_orden} ${tipo_orden} limit ${regNro},${cantidad};`
  }
  if(titulo && !genero && anio){
    return `select * from pelicula where titulo like '%${titulo}%' and anio = ${anio} order by ${columna_orden} ${tipo_orden} limit ${regNro},${cantidad};`
  }
  if(titulo && genero && !anio){
    return `select * from pelicula where titulo like '%${titulo}%' and genero_id = ${genero} order by ${columna_orden} ${tipo_orden} limit ${regNro},${cantidad};`
  }
  if(titulo && genero && anio){
    return `select * from pelicula where titulo like '%${titulo}%' and genero_id = ${genero} and anio = ${anio} order by ${columna_orden} ${tipo_orden} limit ${regNro},${cantidad};`
  }
};

// Se obtiene el total de peliculas que hay en la BBDD
const contarPeliculas = () => {
  return new Promise ((resolve, reject) => {
    conn.query(`select count(id) as cantidad from pelicula`, (error, resultado) => {
      if(error){
        console.log('Hubo un error en la consulta de totales', error.message);
        reject(error);
        return res.status(404).send('Hubo un error en la consulta de totales');
      }
      resolve(resultado[0].cantidad);
    });
  });
};

// Se obtienen todas las peliculas de la BBDD
const obtenerPeliculas = (req, res) => {
  const sql = crearQuery(req.query);

  console.log(sql);

  conn.query(sql, async (error, resultado) => {    
    if(error){
      console.log('Hubo un error en la consulta', error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }  
    const response = {
      'peliculas': resultado,
      'total': await contarPeliculas()
    }
    res.send(JSON.stringify(response));
  });

  console.log('\n----------\nDesde peliculas query\n'+JSON.stringify(req.query));
  console.log('\nreq.query.pagina: '+JSON.stringify(req.query.pagina));
  console.log('req.query.cantidad: '+JSON.stringify(req.query.cantidad));
  console.log('req.query.columna_orden: '+JSON.stringify(req.query.columna_orden));
  console.log('req.query.titulo: '+JSON.stringify(req.query.titulo));
  console.log('req.query.tipo_orden: '+JSON.stringify(req.query.tipo_orden));
  console.log('req.query.genero: '+JSON.stringify(req.query.genero));
  console.log('req.query.anio: '+JSON.stringify(req.query.anio));
  console.log('-----------------------');
  
};

// Se obtienen todos los generos de las peliculas
const obtenerGeneros = (req, res) => {
  const sql = `select * from genero;`;

  conn.query(sql, (error, resultado, campos) => {
    if(error){
      console.log('Hubo un error en la consulta', error.message);
      return res.status(404).send('Hubo un error en la consulta');
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