import Movie from './Movie';
import Category from './Category';
import './App.css';

function App() {
  return (
    <div>
      <h1>Mi Netflix</h1>

      <Category titulo="Ciencia ficción">
        <Movie titulo="Matrix" director="Lana Wachowski" anio={1999} />
        <Movie titulo="Interstellar" director="Christopher Nolan" anio={2014} />
        <Movie titulo="Avatar" director="James Cameron" anio={2009} />
        <Movie titulo="Dune" director="Denis Villeneuve" anio={2021} />
      </Category>

      <Category titulo="Drama">
        <Movie titulo="Titanic" director="James Cameron" anio={1997} />
        <Movie titulo="Forrest Gump" director="Robert Zemeckis" anio={1994} />
        <Movie titulo="El Padrino" director="Francis Ford Coppola" anio={1972} />
      </Category>
    </div>
  );
}

export default App;