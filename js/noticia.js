async function loadArticle() {

  const container =
    document.getElementById(
      "article-container"
    );


  try {

    const params =
      new URLSearchParams(
        window.location.search
      );


    const id =
      params.get("id");


    const response =
      await fetch(
        "data/noticias.json"
      );


    const news =
      await response.json();


    const article =
      news.find(
        item =>
          String(item.id)
          ===
          String(id)
      );


    if (!article) {

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

      return;

    }


    document.title =
      `${article.titulo} | Colegio Henri Fayol`;


    const date =
      new Date(
        article.fecha
        +
        "T12:00:00"
      );


    const formattedDate =
      date.toLocaleDateString(
        "es-CL",
        {
          day: "numeric",
          month: "long",
          year: "numeric"
        }
      );


    const paragraphs =
      (
        article.contenido
        ||
        article.resumen
        ||
        ""
      )

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


    const mainImage =

      article.imagen

        ? `

          <div
            class="
              article-main-image
            "
          >

            <img
              src="${article.imagen}"
              alt="${article.titulo}"
            >

          </div>

        `

        : "";


    let gallery = "";


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


        <div
          class="article-date"
        >

          ${formattedDate}

        </div>

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
      error
    );


    container.innerHTML = `

      <div class="news-empty">

        No fue posible cargar
        la noticia.

      </div>

    `;

  }

}



document.addEventListener(
  "DOMContentLoaded",
  loadArticle
);