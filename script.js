const API_KEY ="586a4bda";

function buscar() {
  const titulo = document.getElementById("titulo").value;
  const url = "https://www.omdbapi.com/?apikey=" + API_KEY + "&t=" + titulo;

  fetch(url) //si no especificamos metodo es GET
    .then(respuesta => respuesta.json())
    .then(datos => {
      if (datos.Response === "False") {
        document.getElementById("resultado").textContent = "No se ha encontrado esa película.";
        return;
      }
      document.getElementById("resultado").textContent = datos.Director + " - " + datos.Year;
    });
}

document.getElementById("buscar").onclick = buscar;
