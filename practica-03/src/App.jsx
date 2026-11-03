import { useState, useEffect } from 'react';
import Movie from './Movie';
import Category from './Category';
import './App.css';

function App() {
  const [categoria, setCategoria] = useState('clasicas'); // la categoría elegida en el selector
  const [peliculas, setPeliculas] = useState([]);         // las películas de esa categoría

  // se ejecuta al cargar la página Y cada vez que cambia "categoria"
  useEffect(() => {
    fetch('http://localhost:3000/peliculas?categoria=' + categoria)  // pido SOLO esa categoría a la API
      .then(res => res.json())
      .then(datos => setPeliculas(datos));
  }, [categoria]);

  return (
    <div>
      <h1>Mi Netflix</h1>

      <select value={categoria} onChange={e => setCategoria(e.target.value)}>
        <option value="clasicas">Clásicas (antes del 2000)</option>
        <option value="modernas">Modernas (del 2000 en adelante)</option>
      </select>

      <Category titulo={categoria === 'clasicas' ? 'Clásicas' : 'Modernas'}>
        {peliculas.map(p => (                  // creo un Movie por cada película
          <Movie key={p.id} titulo={p.nombre} anio={p.anio} actores={p.actores} />
        ))}
      </Category>
    </div>
  );
}

export default App;
