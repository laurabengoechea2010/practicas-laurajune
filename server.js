const express = require('express');  //interpreta peticiones http (libreria)
const fs = require('fs'); //poder escribir y ver archivos
const path = require('path'); // para poder crear rutas de archivos

const app = express(); //llamar a nuestro servidor app
app.use(express.json()); // para poder leer req.body en POST, PUT y PATCH

// Rutas completas a los archivos, junto a server.js
const ARCHIVO_PELICULAS = path.join(__dirname, 'peliculas.json');
const ARCHIVO_ACTORES = path.join(__dirname, 'actores.json');

// ===================== PELÍCULAS =====================

// Buscar películas por nombre: GET /peliculas?nombre=matrix
app.get('/peliculas', (req, res) => {    // req (petición) res (respuesta)
  const peliculas = JSON.parse(fs.readFileSync(ARCHIVO_PELICULAS, 'utf8'));
  const todosActores = JSON.parse(fs.readFileSync(ARCHIVO_ACTORES, 'utf8'));

  const peticion = req.query.nombre;

  if (!peticion) {
    return res.status(400).json({ error: 'Falta el parámetro nombre' });
  }

  const texto = peticion.toLowerCase();
  const encontradas = peliculas.filter(p => p.nombre.toLowerCase().includes(texto)); //busco en mis peliculas si incluye la pelicula de mi peticion

  const resultado = [];

  for (const p of encontradas) {
    // creo la lista de nombres de actores de esta película
    const nombresActores = [];

    for (const idActor of p.actores) {
      const actor = todosActores.find(a => a.id === idActor);
      if (actor) {
        nombresActores.push(actor.nombre);
      } else {
        nombresActores.push('Desconocido');
      }
    }

    // creo la película para la respuesta, con los nombres
    resultado.push({
      id: p.id,
      nombre: p.nombre,
      anio: p.anio,
      actores: nombresActores
    });
  }

  res.json(resultado);
});

// Crear película: POST /peliculas
app.post('/peliculas', (req, res) => {
  const peliculas = JSON.parse(fs.readFileSync(ARCHIVO_PELICULAS, 'utf8'));

  const nombre = req.body.nombre;
  const anio = req.body.anio;
  const actores = req.body.actores;

  if (!nombre || !anio || !actores) {
    return res.status(400).json({ error: 'Faltan nombre, año o actores' });
  }

  if (!Array.isArray(actores)) {
    return res.status(400).json({ error: 'actores tiene que ser una lista de ids' });
  }

  // compruebo que todos los actores existen en actores.json
  const todosActores = JSON.parse(fs.readFileSync(ARCHIVO_ACTORES, 'utf8'));
  for (const idActor of actores) {
    let existe = false;
    for (const a of todosActores) {
      if (a.id === idActor) existe = true;
    }
    if (!existe) {
      return res.status(404).json({ error: 'El actor ' + idActor + ' no existe' });
    }
  }

  // calculo el siguiente id libre
  let nuevoId = 1;
  for (const p of peliculas) {
    if (p.id >= nuevoId) {
      nuevoId = p.id + 1;
    }
  }

  const nueva = {
    id: nuevoId,
    nombre: nombre,
    anio: anio,
    actores: actores
  };

  peliculas.push(nueva); // la añado a la lista (en memoria)

  fs.writeFileSync(ARCHIVO_PELICULAS, JSON.stringify(peliculas, null, 2)); // la guardo en el archivo

  res.status(201).json(nueva); // 201 = creado
});

// Borrar película: DELETE /peliculas/:id
app.delete('/peliculas/:id', (req, res) => {
  const peliculas = JSON.parse(fs.readFileSync(ARCHIVO_PELICULAS, 'utf8'));

  const id_peti = Number(req.params.id); // el id viene como texto en la URL, lo paso a número

  const posicion = peliculas.findIndex(p => p.id === id_peti);

  if (posicion === -1) { //findindex devuelve -1 si no encuentra el numero que pedimos
    return res.status(404).json({ error: 'Película no encontrada' });
  }

  const borrada = peliculas[posicion];
  peliculas.splice(posicion, 1); // la quito de la lista (en memoria)

  fs.writeFileSync(ARCHIVO_PELICULAS, JSON.stringify(peliculas, null, 2)); // guardo en el archivo

  res.json(borrada);
});

// ⭐ Modificar película (cambiar nombre y/o año): PATCH /peliculas/:id
app.patch('/peliculas/:id', (req, res) => {
  const peliculas = JSON.parse(fs.readFileSync(ARCHIVO_PELICULAS, 'utf8'));

  const id = Number(req.params.id);
  const pelicula = peliculas.find(p => p.id === id);

  if (!pelicula) {
    return res.status(404).json({ error: 'Película no encontrada' });
  }

  const nombre = req.body.nombre;
  const anio = req.body.anio;

  if (!nombre && !anio) {
    return res.status(400).json({ error: 'Manda al menos nombre o año' });
  }

  if (nombre) {
    pelicula.nombre = nombre; // cambio el nombre solo si lo mandan
  }
  if (anio) {
    pelicula.anio = anio; // cambio el año solo si lo mandan
  }

  fs.writeFileSync(ARCHIVO_PELICULAS, JSON.stringify(peliculas, null, 2));
  res.json(pelicula);
  const id = Number(req.params.id);
    return res.status(404).json({ error: 'Película no encontrada' });
  }
  const posicion = pelicula.actores.findIndex(a => a === idActor);
  if (posicion === -1) {
    return res.status(404).json({ error: 'Ese actor no está en la película' });

// Crear actor: POST /actores
  const anio = req.body.anio;

  if (!nombre || !anio) {
    return res.status(400).json({ error: 'Faltan nombre o año' });

  let nuevoId = 1;
  for (const a of actores) {
      nuevoId = a.id + 1;
    }
  }

  const nuevo = { id: nuevoId, nombre: nombre, anio: anio };
  actores.push(nuevo);

  fs.writeFileSync(ARCHIVO_ACTORES, JSON.stringify(actores, null, 2));
  res.status(201).json(nuevo);
});

// Borrar actor: DELETE /actores/:id
app.delete('/actores/:id', (req, res) => {
  const actores = JSON.parse(fs.readFileSync(ARCHIVO_ACTORES, 'utf8'));
  const peliculas = JSON.parse(fs.readFileSync(ARCHIVO_PELICULAS, 'utf8'));

  const id = Number(req.params.id);
  const posicion = actores.findIndex(a => a.id === id);

  if (posicion === -1) {
    return res.status(404).json({ error: 'Actor no encontrado' });
  }

  const borrado = actores[posicion];
  actores.splice(posicion, 1);

  // lo quito también de todas las películas donde aparezca
  for (const p of peliculas) {
    p.actores = p.actores.filter(idActor => idActor !== id);
  }

  fs.writeFileSync(ARCHIVO_ACTORES, JSON.stringify(actores, null, 2));
  fs.writeFileSync(ARCHIVO_PELICULAS, JSON.stringify(peliculas, null, 2));
  res.json(borrado);
});

// Modificar actor (nombre y/o año): PATCH /actores/:id
app.patch('/actores/:id', (req, res) => {
  const actores = JSON.parse(fs.readFileSync(ARCHIVO_ACTORES, 'utf8'));
  res.json(actor);
});

app.listen(3000);
  fs.writeFileSync(ARCHIVO_ACTORES, JSON.stringify(actores, null, 2));
    actor.anio = anio;
  }

  }
  if (anio) {
  const id = Number(req.params.id);
    actor.nombre = nombre;
  const actor = actores.find(a => a.id === id);

  if (nombre) {

  }
  if (!actor) {
    return res.status(404).json({ error: 'Actor no encontrado' });
  }

  const nombre = req.body.nombre;
  const anio = req.body.anio;

  if (!nombre && !anio) {
    return res.status(400).json({ error: 'Manda al menos nombre o año' });
    if (a.id >= nuevoId) {
  }
  const actores = JSON.parse(fs.readFileSync(ARCHIVO_ACTORES, 'utf8'));

  const nombre = req.body.nombre;
app.post('/actores', (req, res) => {
  }
});

// ===================== ACTORES =====================

  pelicula.actores.splice(posicion, 1); // lo quito de la lista de actores de la película
  fs.writeFileSync(ARCHIVO_PELICULAS, JSON.stringify(peliculas, null, 2));
  res.json(pelicula);


  const pelicula = peliculas.find(p => p.id === id);
  if (!pelicula) {
  const idActor = Number(req.params.idActor);

// Quitar actor de una película: DELETE /peliculas/:id/actores/:idActor

app.delete('/peliculas/:id/actores/:idActor', (req, res) => {
  const peliculas = JSON.parse(fs.readFileSync(ARCHIVO_PELICULAS, 'utf8'));
  const id = Number(req.params.id);
  res.status(201).json(pelicula);

});
  const idActor = req.body.idActor;
  fs.writeFileSync(ARCHIVO_PELICULAS, JSON.stringify(peliculas, null, 2));
  pelicula.actores.push(idActor);

  }

  }
  if (!actor) {
    return res.status(400).json({ error: 'El actor ya está en la película' });

  if (pelicula.actores.includes(idActor)) {
    return res.status(404).json({ error: 'Actor no encontrado' });
  }

  const actor = todosActores.find(a => a.id === idActor);

    return res.status(404).json({ error: 'Película no encontrada' });
  const pelicula = peliculas.find(p => p.id === id);
  if (!pelicula) {
});

