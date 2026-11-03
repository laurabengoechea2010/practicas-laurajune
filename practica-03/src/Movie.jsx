import { useState } from 'react';

function Movie({ titulo, anio, actores }) {   // los datos que le pasan (props)
  const [abierto, setAbierto] = useState(false); // empieza cerrado

  return (
    <div className="movie">
      <h3>{titulo}</h3>

      {abierto && (                       // solo se enseña si abierto es true
        <div>
          <p>Actores: {actores.join(', ')}</p>
          <p>Año: {anio}</p>
        </div>
      )}

      <button onClick={() => setAbierto(!abierto)}>
        {abierto ? 'Menos información' : 'Más información'}
      </button>
    </div>
  );
}

export default Movie;   // para poder usarlo en otros archivos