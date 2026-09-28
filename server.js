const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Ruta completa al archivo, junto a server.js
const ARCHIVO_PELICULAS = path.join(__dirname, 'peliculas.json');

// Buscar películas por nombre: GET /peliculas?nombre=matrix
app.get('/peliculas', (req, res) => {
  const peliculas = JSON.parse(fs.readFileSync(ARCHIVO_PELICULAS, 'utf8'));

  const peticion = req.query.nombre;

  if (!nombre) {
    return res.status(400).json({ error: 'Falta el parámetro nombre' });
  }

  const texto = peticion.toLowerCase();
  const encontradas = peliculas.filter(p => p.nombre.toLowerCase().includes(texto));

  res.json(encontradas);
});

app.listen(3000);
