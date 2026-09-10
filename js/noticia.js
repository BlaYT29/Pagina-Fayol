async function loadArticle() {

  const container =
    document.getElementById(
      "article-container"
    );


  if (!container) {
    return;
  }


  try {

    /* =====================================
       OBTENER ID DE LA URL
    ===================================== */

    const params =
      new URLSearchParams(
        window.location.search
      );


    const id =
      params.get("id");


    if (!id) {

      showArticleNotFound(
        container
      );

      return;

    }



    /* =====================================
       CARGAR NOTICIAS
    ===================================== */

    const response =
      await fetch(
        "data/noticias.json"
      );


    if (!response.ok) {

      throw new Error(
        "No se pudo cargar noticias.json"
      );

    }


    const news =
      await response.json();



    /* =====================================
       BUSCAR NOTICIA
    ===================================== */

    const article =
      news.find(
        item =>
          String(item.id) ===
          String(id)
      );


    if (!article) {

      showArticleNotFound(
        container
      );

      return;

    }



    /* =====================================
       TÍTULO DE LA PESTAÑA
    ===================================== */

    document.title =
      `${article.titulo} | Colegio Henri Fayol`;



    /* =====================================
       FECHA
    ===================================== */

    let formattedDate =
      "";


    if (article.fecha) {

      const date =
        new Date(
          `${article.fecha}T12:00:00`
        );


      if (
        !Number.isNaN(
          date.getTime()
        )
      ) {

        formattedDate =
          date.toLocaleDateString(
            "es-CL",
            {
              day: "numeric",
              month: "long",
              year: "numeric"
            }
          );

      }

    }



    /* =====================================
       CONTENIDO
    ===================================== */

    let paragraphs =
      "";


    /*
      SOPORTA:

      "contenido": [
        "Párrafo uno",
        "Párrafo dos"
      ]

      Y TAMBIÉN:

      "contenido": "Párrafo uno\nPárrafo dos"
    */


    if (
      Array.isArray(
        article.contenido
      )
    ) {

      paragraphs =
        article.contenido

          .filter(
            paragraph =>
              paragraph &&
              paragraph.trim()
          )

          .map(
            paragraph =>
              `<p>${paragraph}</p>`
          )

          .join("");

    }


    else if (
      typeof article.contenido ===
      "string"
    ) {

      paragraphs =
        article.contenido

          .split("\n")

          .filter(
            paragraph =>
              paragraph.trim()
          )

          .map(
            paragraph =>
              `<p>${paragraph}</p>`
          )

          .join("");

    }


    else if (
      article.resumen
    ) {

      paragraphs =
        `<p>${article.resumen}</p>`;

    }



    /* =====================================
       IMAGEN PRINCIPAL
    ===================================== */

    const mainImage =

      article.imagen

        ? `

          <div
            class="article-main-image"
          >

            <img
              src="${article.imagen}"
              alt="${
                article.imagenAlt
                ||
                article.titulo
              }"
            >

          </div>

        `

        : "";



    /* =====================================
       GALERÍA DE NOTICIA
    ===================================== */

    let gallery =
      "";


    if (
      Array.isArray(
        article.galeria
      )
      &&
      article.galeria.length
    ) {

      gallery = `

        <div
          class="article-gallery"
        >

          ${
            article.galeria

              .map(
                image => `

                  <img
                    src="${image}"
                    alt="${article.titulo}"
                    loading="lazy"
                  >

                `
              )

              .join("")
          }

        </div>

      `;

    }



    /* =====================================
       RENDER NOTICIA
    ===================================== */

    container.innerHTML = `

      <header
        class="article-header"
      >

        <span
          class="article-category"
        >

          ${
            article.categoria
            ||
            "Noticias"
          }

        </span>


        <h1>
          ${article.titulo}
        </h1>


        ${
          formattedDate
            ? `

              <div
                class="article-date"
              >

                ${formattedDate}

              </div>

            `
            : ""
        }

      </header>


      ${mainImage}


      <div
        class="article-content"
      >

        ${paragraphs}

      </div>


      ${gallery}


      <div
        class="article-back"
      >

        <a
          href="noticias.html"
        >

          ← Volver a todas
          las noticias

        </a>

      </div>

    `;

  }


  catch (
    error
  ) {

    console.error(
      "Error cargando noticia:",
      error
    );


    container.innerHTML = `

      <div class="news-empty">

        <h2>
          No fue posible cargar la noticia
        </h2>

        <p>
          Ocurrió un problema al cargar
          esta información.
        </p>

        <br>

        <a
          href="noticias.html"
          class="featured-news-link"
        >
          Volver a noticias
        </a>

      </div>

    `;

  }

}



/* =========================================================
   NOTICIA NO ENCONTRADA
========================================================= */

function showArticleNotFound(
  container
) {

  container.innerHTML = `

    <div class="news-empty">

      <h2>
        Noticia no encontrada
      </h2>

      <p>
        La noticia que buscas
        no está disponible.
      </p>

      <br>

      <a
        href="noticias.html"
        class="featured-news-link"
      >

        Volver a noticias

      </a>

    </div>

  `;

}



/* =========================================================
   INICIAR
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  loadArticle
);