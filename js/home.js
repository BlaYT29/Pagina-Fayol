let homeSchool = null;

let homeHeroSlides = [];

let currentHeroSlide = 0;

let heroInterval = null;


/* =========================================
   CARGAR JSON
========================================= */

async function loadJSON(path) {

  const response =
    await fetch(path);


  if (!response.ok) {

    throw new Error(
      `No se pudo cargar ${path}`
    );

  }


  return await response.json();

}



/* =========================================
   HERO
========================================= */

function renderHero() {

  if (!homeHeroSlides.length) {
    return;
  }


  const slide =
    homeHeroSlides[
      currentHeroSlide
    ];


  const hero =
    document.getElementById(
      "home-hero"
    );


  document.getElementById(
    "home-hero-label"
  ).textContent =
    slide.etiqueta || "";


  document.getElementById(
    "home-hero-title"
  ).textContent =
    slide.titulo || "";


  document.getElementById(
    "home-hero-description"
  ).textContent =
    slide.descripcion || "";


  const actions =
    document.getElementById(
      "home-hero-actions"
    );


  let buttons = "";


  if (slide.boton1) {

    buttons += `

      <a
        href="${slide.boton1.link}"
        class="home-hero-primary"
      >
        ${slide.boton1.texto}
      </a>

    `;

  }


  if (slide.boton2) {

    buttons += `

      <a
        href="${slide.boton2.link}"
        class="home-hero-secondary"
      >
        ${slide.boton2.texto}
      </a>

    `;

  }


  actions.innerHTML =
    buttons;


  if (slide.imagen) {

    hero.style.backgroundImage =
      `url("${slide.imagen}")`;

  }

  else {

    hero.style.backgroundImage =
      "";

  }


  document.getElementById(
    "hero-counter"
  ).textContent =

    `${String(
      currentHeroSlide + 1
    ).padStart(2, "0")} / ${String(
      homeHeroSlides.length
    ).padStart(2, "0")}`;

}


function changeHero(
  direction
) {

  currentHeroSlide =
    (
      currentHeroSlide
      +
      direction
      +
      homeHeroSlides.length
    )
    %
    homeHeroSlides.length;


  renderHero();

  restartHeroInterval();

}


function restartHeroInterval() {

  clearInterval(
    heroInterval
  );


  if (
    homeHeroSlides.length <= 1
  ) {

    return;

  }


  heroInterval =
    setInterval(
      () => {

        currentHeroSlide =
          (
            currentHeroSlide + 1
          )
          %
          homeHeroSlides.length;


        renderHero();

      },
      7000
    );

}



/* =========================================
   PRESENTACIÓN
========================================= */

function renderHomeAbout() {

  const info =
    homeSchool
      .inicio
      .presentacion;


  document.getElementById(
    "home-about-label"
  ).textContent =
    info.etiqueta;


  document.getElementById(
    "home-about-title"
  ).textContent =
    info.titulo;


  document.getElementById(
    "home-about-text"
  ).textContent =
    info.texto;

}



/* =========================================
   ESTADÍSTICAS
========================================= */

function renderHomeStats(
  stats
) {

  const container =
    document.getElementById(
      "home-stats-grid"
    );


  container.innerHTML =
    stats
      .map(
        stat => `

          <article class="home-stat reveal">

            <strong>

              ${stat.prefijo || ""}

              <span
                class="home-stat-number"
                data-value="${stat.valor}"
              >
                0
              </span>

              ${stat.sufijo || ""}

            </strong>


            <h3>
              ${stat.titulo}
            </h3>


            <p>
              ${stat.descripcion}
            </p>

          </article>

        `
      )
      .join("");

}



/* =========================================
   NIVELES
========================================= */

function renderHomeLevels() {

  const container =
    document.getElementById(
      "home-levels-grid"
    );


  container.innerHTML =
    homeSchool.niveles
      .map(
        (
          nivel,
          index
        ) => `

          <article
            class="home-level-card reveal"
          >

            <span class="home-level-index">
              0${index + 1}
            </span>


            <span class="home-level-range">
              ${nivel.rango}
            </span>


            <h3>
              ${nivel.titulo}
            </h3>


            <p>
              ${nivel.descripcion}
            </p>

          </article>

        `
      )
      .join("");

}



/* =========================================
   NOTICIAS
========================================= */

function formatHomeDate(
  value
) {

  if (!value) {
    return "";
  }


  const date =
    new Date(
      value + "T12:00:00"
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


function renderHomeNews(
  news
) {

  const container =
    document.getElementById(
      "home-news-grid"
    );


  if (!news.length) {

    container.innerHTML = `

      <div class="home-empty">
        Próximamente publicaremos nuevas noticias.
      </div>

    `;

    return;

  }


  const latest =
    [...news]
      .sort(
        (
          a,
          b
        ) =>

          new Date(
            b.fecha || 0
          )
          -
          new Date(
            a.fecha || 0
          )
      )
      .slice(
        0,
        3
      );


  container.innerHTML =
    latest
      .map(
        item => {

          const image =
            item.imagen

              ? `

                <div class="home-news-image">

                  <img
                    src="${item.imagen}"
                    alt="${item.titulo}"
                    loading="lazy"
                  >

                </div>

              `

              : "";


          return `

            <article class="home-news-card reveal">

              ${image}


              <div class="home-news-content">

                <span class="home-news-category">
                  ${item.categoria || "Noticias"}
                </span>


                <span class="home-news-date">
                  ${formatHomeDate(item.fecha)}
                </span>


                <h3>
                  ${item.titulo}
                </h3>


                <p>
                  ${
                    item.resumen
                    ||
                    item.descripcion
                    ||
                    ""
                  }
                </p>


                <a
                  href="noticia.html?id=${encodeURIComponent(item.id)}"
                >
                  Leer noticia →
                </a>

              </div>

            </article>

          `;

        }
      )
      .join("");

}



/* =========================================
   GALERÍA
========================================= */

function renderHomeGallery(
  gallery
) {

  const container =
    document.getElementById(
      "home-gallery-grid"
    );


  if (!gallery.length) {

    container.innerHTML = `

      <div class="home-empty">
        Próximamente agregaremos nuevas fotografías.
      </div>

    `;

    return;

  }


  const photos =
    gallery
      .filter(
        item =>
          item.imagen
      )
      .slice(
        0,
        5
      );


  container.innerHTML =
    photos
      .map(
        (
          photo,
          index
        ) => `

          <a
            href="galeria.html"
            class="
              home-gallery-item
              home-gallery-item-${index + 1}
              reveal
            "
          >

            <img
              src="${photo.imagen}"
              alt="${photo.titulo || "Colegio Henri Fayol"}"
              loading="lazy"
            >


            <div class="home-gallery-overlay">

              <span>
                ${photo.categoria || ""}
              </span>


              <strong>
                ${photo.titulo || ""}
              </strong>

            </div>

          </a>

        `
      )
      .join("");

}



/* =========================================
   PRÓXIMAS FECHAS
========================================= */

function renderHomeDates(
  dates
) {

  const container =
    document.getElementById(
      "home-dates-grid"
    );


  const today =
    new Date();


  today.setHours(
    0,
    0,
    0,
    0
  );


  const upcoming =
    dates

      .filter(
        item => {

          if (
            !item.fecha
            ||
            item.estado === "pendiente"
          ) {

            return false;

          }


          const date =
            new Date(
              item.fecha +
              "T12:00:00"
            );


          return (
            date >= today
            &&
            item.visibleEnInicio !== false
          );

        }
      )

      .sort(
        (
          a,
          b
        ) =>

          new Date(a.fecha)
          -
          new Date(b.fecha)
      )

      .slice(
        0,
        3
      );


  if (!upcoming.length) {

    container.innerHTML = `

      <div class="home-empty">
        Próximamente publicaremos nuevas fechas importantes.
      </div>

    `;

    return;

  }


  container.innerHTML =
    upcoming
      .map(
        item => {

          const date =
            new Date(
              item.fecha +
              "T12:00:00"
            );


          const day =
            date.getDate();


          const month =
            date
              .toLocaleDateString(
                "es-CL",
                {
                  month: "short"
                }
              )
              .replace(".", "")
              .toUpperCase();


          return `

            <article class="home-date-card reveal">

              <div class="home-date-number">

                <strong>
                  ${day}
                </strong>

                <span>
                  ${month}
                </span>

              </div>


              <div>

                <span class="home-date-category">
                  ${item.categoria}
                </span>


                <h3>
                  ${item.titulo}
                </h3>


                <p>
                  ${item.descripcion || ""}
                </p>

              </div>

            </article>

          `;

        }
      )
      .join("");

}



/* =========================================
   ANIMACIÓN CONTADORES
========================================= */

function animateStatistics() {

  document
    .querySelectorAll(
      ".home-stat-number"
    )
    .forEach(
      element => {

        const target =
          Number(
            element.dataset.value
          );


        let current =
          0;


        const duration =
          1300;


        const start =
          performance.now();


        function animate(
          time
        ) {

          const progress =
            Math.min(
              (
                time - start
              )
              /
              duration,
              1
            );


          current =
            Math.floor(
              target * progress
            );


          element.textContent =
            current.toLocaleString(
              "es-CL"
            );


          if (
            progress < 1
          ) {

            requestAnimationFrame(
              animate
            );

          }

        }


        requestAnimationFrame(
          animate
        );

      }
    );

}



/* =========================================
   REVEAL
========================================= */

function initializeHomeReveal() {

  const elements =
    document.querySelectorAll(
      ".reveal"
    );


  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(
          entry => {

            if (
              entry.isIntersecting
            ) {

              entry.target
                .classList
                .add("visible");


              observer.unobserve(
                entry.target
              );

            }

          }
        );

      },
      {
        threshold: 0.12
      }
    );


  elements.forEach(
    element =>
      observer.observe(
        element
      )
  );

}



/* =========================================
   INICIO
========================================= */

async function initializeHome() {

  try {

    const [
      school,
      stats,
      news,
      gallery,
      dates
    ] = await Promise.all([

      loadJSON(
        "data/colegio.json"
      ),

      loadJSON(
        "data/estadisticas.json"
      ),

      loadJSON(
        "data/noticias.json"
      ),

      loadJSON(
        "data/galeria.json"
      ),

      loadJSON(
        "data/fechas.json"
      )

    ]);


    homeSchool =
      school;


    homeHeroSlides =
      school.inicio.hero || [];


    renderHero();

    renderHomeAbout();

    renderHomeStats(
      stats
    );

    renderHomeLevels();

    renderHomeNews(
      news
    );

    renderHomeGallery(
      gallery
    );

    renderHomeDates(
      dates
    );


    document.getElementById(
      "hero-prev"
    ).addEventListener(
      "click",
      () => changeHero(-1)
    );


    document.getElementById(
      "hero-next"
    ).addEventListener(
      "click",
      () => changeHero(1)
    );


    restartHeroInterval();

    initializeHomeReveal();

    animateStatistics();

  }


  catch (error) {

    console.error(
      "Error cargando Inicio:",
      error
    );

  }

}


document.addEventListener(
  "DOMContentLoaded",
  initializeHome
);