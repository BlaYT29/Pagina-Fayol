let allNews = [];

let filteredNews = [];

let selectedCategory = "Todas";

let visibleNews = 6;



async function getNewsData() {

  const response =
    await fetch(
      "data/noticias.json"
    );


  if (!response.ok) {

    throw new Error(
      "No se pudieron cargar las noticias."
    );

  }


  return await response.json();

}



function formatNewsDate(
  dateString
) {

  const date =
    new Date(
      dateString
      +
      "T12:00:00"
    );


  return date.toLocaleDateString(
    "es-CL",
    {
      day: "numeric",
      month: "long",
      year: "numeric"
    }
  );

}



function createCategories() {

  const container =
    document.getElementById(
      "news-categories"
    );


  const categories = [

    "Todas",

    ...new Set(

      allNews
        .map(
          news =>
            news.categoria
        )
        .filter(Boolean)

    )

  ];


  container.innerHTML =
    categories
      .map(
        category => `

          <button
            class="
              news-category-button

              ${
                category
                ===
                selectedCategory

                  ? "active"

                  : ""
              }
            "

            data-category="
              ${category}
            "
          >

            ${category}

          </button>

        `
      )
      .join("");


  document
    .querySelectorAll(
      ".news-category-button"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            selectedCategory =
              button.dataset.category;


            visibleNews = 6;


            filterNews();


            createCategories();

          }
        );

      }
    );

}



function filterNews() {

  const search =
    document
      .getElementById(
        "news-search-input"
      )
      .value
      .trim()
      .toLowerCase();


  filteredNews =
    allNews.filter(
      news => {

        const matchesCategory =

          selectedCategory
            ===
            "Todas"

          ||

          news.categoria
            ===
            selectedCategory;


        const searchableText = `

          ${news.titulo || ""}

          ${news.resumen || ""}

          ${news.contenido || ""}

          ${news.categoria || ""}

        `.toLowerCase();


        const matchesSearch =
          searchableText.includes(
            search
          );


        return (
          matchesCategory
          &&
          matchesSearch
        );

      }
    );


  renderFeaturedNews();

  renderNewsGrid();

}



function renderFeaturedNews() {

  const container =
    document.getElementById(
      "featured-news"
    );


  if (
    !filteredNews.length
  ) {

    container.innerHTML = "";

    return;

  }


  const item =
    filteredNews[0];


  const image =

    item.imagen

      ? `
        <img
          src="${item.imagen}"
          alt="${item.titulo}"
        >
      `

      : "";


  container.innerHTML = `

    <article
      class="featured-news"
    >

      <div
        class="featured-news-image"
      >

        ${image}

      </div>


      <div
        class="featured-news-content"
      >

        <span
          class="featured-news-category"
        >
          ${
            item.categoria
            ||
            "Noticias"
          }
        </span>


        <span
          class="featured-news-date"
        >

          ${formatNewsDate(
            item.fecha
          )}

        </span>


        <h2>
          ${item.titulo}
        </h2>


        <p>
          ${item.resumen || ""}
        </p>


        <a
          href="noticia.html?id=${item.id}"
          class="featured-news-link"
        >

          Leer noticia

        </a>

      </div>

    </article>

  `;

}



function renderNewsGrid() {

  const grid =
    document.getElementById(
      "news-page-grid"
    );


  const loadMoreWrapper =
    document.getElementById(
      "load-more-wrapper"
    );


  if (
    !filteredNews.length
  ) {

    grid.innerHTML = `

      <div class="news-empty">

        No encontramos noticias
        que coincidan con tu búsqueda.

      </div>

    `;


    loadMoreWrapper.style.display =
      "none";


    return;

  }


  const newsToShow =
    filteredNews.slice(
      0,
      visibleNews
    );


  grid.innerHTML =
    newsToShow
      .map(
        item => {

          const image =

            item.imagen

              ? `
                <img
                  src="${item.imagen}"
                  alt="${item.titulo}"
                  loading="lazy"
                >
              `

              : "";


          return `

            <article
              class="news-page-card"
            >

              <a
                href="noticia.html?id=${item.id}"
                class="news-page-card-image"
              >

                ${image}


                <span
                  class="
                    news-page-card-category
                  "
                >

                  ${
                    item.categoria
                    ||
                    "Noticias"
                  }

                </span>

              </a>


              <div
                class="
                  news-page-card-content
                "
              >

                <span
                  class="
                    news-page-card-date
                  "
                >

                  ${formatNewsDate(
                    item.fecha
                  )}

                </span>


                <h3>
                  ${item.titulo}
                </h3>


                <p>
                  ${item.resumen || ""}
                </p>


                <a
                  href="noticia.html?id=${item.id}"
                  class="
                    news-page-card-link
                  "
                >

                  Leer noticia →

                </a>

              </div>

            </article>

          `;

        }
      )
      .join("");


  if (
    visibleNews
    >=
    filteredNews.length
  ) {

    loadMoreWrapper.style.display =
      "none";

  }

  else {

    loadMoreWrapper.style.display =
      "block";

  }

}



async function initializeNewsPage() {

  try {

    allNews =
      await getNewsData();


    allNews.sort(
      (
        a,
        b
      ) =>

        new Date(b.fecha)
        -
        new Date(a.fecha)
    );


    filteredNews =
      [...allNews];


    createCategories();

    renderFeaturedNews();

    renderNewsGrid();


    document
      .getElementById(
        "news-search-input"
      )
      .addEventListener(
        "input",
        () => {

          visibleNews = 6;

          filterNews();

        }
      );


    document
      .getElementById(
        "load-more-button"
      )
      .addEventListener(
        "click",
        () => {

          visibleNews += 6;

          renderNewsGrid();

        }
      );

  }

  catch (
    error
  ) {

    console.error(
      error
    );

  }

}



document.addEventListener(
  "DOMContentLoaded",
  initializeNewsPage
);