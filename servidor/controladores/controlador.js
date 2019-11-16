const conn = require('../lib/conexionbd')

// Crea la query para obtener las películas según los parametros que reciba
const crearQueryObtenerPeliculas = (seleccionUsuario) => {
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
        console.log('Hubo un error en la consulta para contar la cantidad de peliculas', error.message);
        reject(error);
        return res.status(404).send('Hubo un error en la consulta para contar la cantidad de peliculas');
      }
      resolve(resultado[0].cantidad);
    });
  });
};


// Se obtienen todas las peliculas de la BBDD
const obtenerPeliculas = (req, res) => {
  const sql = crearQueryObtenerPeliculas(req.query);

  conn.query(sql, async (error, resultado) => {    
    if(error){
      console.log('Hubo un error en la consulta para obtener las películas', error.message);
      return res.status(404).send('Hubo un error en la consulta  para obtener las películas');
    }  
    const response = {
      'peliculas': resultado,
      'total': await contarPeliculas()
    }
    res.send(JSON.stringify(response));
  });
};


// Se obtienen todos los generos de las peliculas
const obtenerGeneros = (req, res) => {
  const sql = `select * from genero;`;

  conn.query(sql, (error, resultado, campos) => {
    if(error){
      console.log('Hubo un error en la consulta para obtener los géneros', error.message);
      return res.status(404).send('Hubo un error en la consulta para obtener los géneros');
    }
    const response = {
      'generos': resultado
    }
    res.send(JSON.stringify(response));
  });
}


// Se obtienen los actores de una pelicula
const obtenerActores = (id) => {
  sql = `select actor.nombre
          from actor
          join actor_pelicula
          on actor.id = actor_pelicula.actor_id
          where actor_pelicula.pelicula_id = ${id};`;
  
  return new Promise ((resolve, reject) => {
    conn.query(sql, (error, resultado) => {
      if(error){
        console.log('Hubo un error en la consulta para obtener los actores', error.message);
        reject(error);
        return res.status(404).send('Hubo un error en la consulta para obtener los actores');
      }
      
      resolve(JSON.stringify(resultado));
    });
  });
};


// Dado un id devuelve la información de una película
const obtenerInfoPelicula = (req, res) => {
  
  const peliculaID = req.params.id;

  const sql = `select pelicula.poster, pelicula.titulo, pelicula.anio, pelicula.trama, pelicula.fecha_lanzamiento, pelicula.director, pelicula.duracion, pelicula.puntuacion, genero.nombre
                from pelicula 
                join genero
                on pelicula.genero_id = genero.id
                where pelicula.id = ${peliculaID};`  

  conn.query(sql, async (error, result) => {    
    if(error){
      console.log('Hubo un error en la consulta para obtener la información de las películas', error.message);
      return res.status(404).send('Hubo un error en la consulta para obtener la información de las películas');
    }

    const resultado = result[0];

    if (resultado===undefined) {
      return res.status(404).send({message: 'No se encontró la película'});
    }
    else {
      const response = {
        'pelicula' : {
          'poster' : resultado.poster,
          'titulo' : resultado.titulo,
          'anio' : resultado.anio,
          'trama' : resultado.trama,
          'fecha_lanzamiento' : resultado.fecha_lanzamiento,
          'director' : resultado.director,
          'duracion' : resultado.duracion,
          'puntuacion' : resultado.puntuacion,
          'nombre' : resultado.nombre // corresponde al genero de la pelicula
        },
        actores: await obtenerActores(peliculaID)
      }
      res.send(JSON.stringify(response));
    }
  });
};


// Crea la query para obtener las películas según los parametros que reciba
const crearQueryObtenerRecomendacion = (seleccionUsuario) => {
  const anio_inicio = seleccionUsuario.anio_inicio;
  const anio_fin = seleccionUsuario.anio_fin;
  const genero = seleccionUsuario.genero;
  const puntuacion = seleccionUsuario.puntuacion;
  
  if(!anio_inicio && !anio_fin && !genero && !puntuacion){
    return `select pelicula.id, pelicula.poster, pelicula.trama, pelicula.titulo, genero.nombre as nombre
              from pelicula
              join genero
              on pelicula.genero_id = genero.id;`
  }
  if(!anio_inicio && !anio_fin && genero && !puntuacion){
    return `select pelicula.id, pelicula.poster, pelicula.trama, pelicula.titulo, genero.nombre as nombre
              from pelicula
              join genero
              on pelicula.genero_id = genero.id
              where genero.nombre = '${genero}';`
  }
  if(!anio_inicio && !anio_fin && !genero && puntuacion){
    return `select pelicula.id, pelicula.poster, pelicula.trama, pelicula.titulo, genero.nombre as nombre
              from pelicula
              join genero
              on pelicula.genero_id = genero.id
              where pelicula.puntuacion >= ${puntuacion};`
  }
  if(!anio_inicio && !anio_fin && genero && puntuacion){
    return `select pelicula.id, pelicula.poster, pelicula.trama, pelicula.titulo, genero.nombre as nombre
              from pelicula
              join genero
              on pelicula.genero_id = genero.id
              where genero.nombre = '${genero}'
              and pelicula.puntuacion >= ${puntuacion};`
  }
  if(anio_inicio && anio_fin && !genero && !puntuacion){
    return `select pelicula.id, pelicula.poster, pelicula.trama, pelicula.titulo, genero.nombre as nombre
              from pelicula
              join genero
              on pelicula.genero_id = genero.id
              where pelicula.anio between ${anio_inicio} and ${anio_fin};`
  }
  if(anio_inicio && anio_fin && !genero && puntuacion){
    return `select pelicula.id, pelicula.poster, pelicula.trama, pelicula.titulo, genero.nombre as nombre
              from pelicula
              join genero
              on pelicula.genero_id = genero.id
              where pelicula.anio between ${anio_inicio} and ${anio_fin} 
              and pelicula.puntuacion >= ${puntuacion};`
  }
  if(anio_inicio && anio_fin && genero && !puntuacion){
    return `select pelicula.id, pelicula.poster, pelicula.trama, pelicula.titulo, genero.nombre as nombre
              from pelicula
              join genero
              on pelicula.genero_id = genero.id
              where pelicula.anio between ${anio_inicio} and ${anio_fin}
              and genero.nombre = '${genero}';`
  }
  if(anio_inicio && anio_fin && genero && puntuacion){
    return `select pelicula.id, pelicula.poster, pelicula.trama, pelicula.titulo, genero.nombre as nombre
              from pelicula
              join genero
              on pelicula.genero_id = genero.id
              where pelicula.anio between ${anio_inicio} and ${anio_fin}
              and genero.nombre = '${genero}'
              and pelicula.puntuacion >= ${puntuacion};`
  }
};

// Se ofrece una recomendación de pelicula al usuario según su selección
const obtenerRecomendacion = (req, res) => {
  
  const sql = crearQueryObtenerRecomendacion(req.query);
  
  conn.query(sql, (error, resultado) => {    
    if(error){
      console.log('Hubo un error en la consulta para obtener las películas recomendadas', error.message);
      return res.status(404).send('Hubo un error en la consulta para obtener las películas recomendadas');
    }  
    const response = {
      'peliculas': resultado,
    }
    res.send(JSON.stringify(response));
  });
};


module.exports = {
  obtenerPeliculas: obtenerPeliculas,
  obtenerGeneros: obtenerGeneros,
  obtenerInfoPelicula: obtenerInfoPelicula,
  obtenerRecomendacion: obtenerRecomendacion
};