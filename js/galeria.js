let galleryPhotos = [];

let filteredGalleryPhotos = [];

let selectedGalleryCategory =
  "Todas";

let currentGalleryIndex =
  0;


/* =========================================
   CARGAR DATOS
========================================= */

async function loadGalleryData() {

  const response =
    await fetch(
      "data/galeria.json"
    );


  if (!response.ok) {

    throw new Error(
      "No se pudo cargar galeria.json"
    );

  }


  return await response.json();

}


/* =========================================
   CATEGORÍAS
========================================= */

function renderGalleryFilters() {

  const container =
    document.getElementById(
      "gallery-filters"
    );


  const categories = [

    "Todas",

    ...new Set(

      galleryPhotos
        .map(
          photo =>
            photo.categoria
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
              gallery-filter-button

              ${
                selectedGalleryCategory
                === category

                  ? "active"

                  : ""
              }
            "

            type="button"

            data-category="${category}"
          >

            ${category}

          </button>

        `
      )
      .join("");


  document
    .querySelectorAll(
      ".gallery-filter-button"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            selectedGalleryCategory =
              button.dataset.category;


            renderGalleryFilters();

            filterGallery();

          }
        );

      }
    );

}


/* =========================================
   FILTRAR
========================================= */

function filterGallery() {

  if (
    selectedGalleryCategory
    ===
    "Todas"
  ) {

    filteredGalleryPhotos =
      [...galleryPhotos];

  }

  else {

    filteredGalleryPhotos =
      galleryPhotos.filter(
        photo =>
          photo.categoria
          ===
          selectedGalleryCategory
      );

  }


  renderGallery();

}


/* =========================================
   GRID
========================================= */

function renderGallery() {

  const grid =
    document.getElementById(
      "gallery-grid"
    );


  const total =
    document.getElementById(
      "gallery-total"
    );


  total.textContent =
    filteredGalleryPhotos.length;


  if (
    filteredGalleryPhotos.length
    ===
    0
  ) {

    grid.innerHTML = `

      <div class="gallery-empty">

        <strong>
          Próximamente
        </strong>

        <p>
          Estamos preparando fotografías
          de nuestra comunidad educativa.
        </p>

      </div>

    `;


    return;

  }


  grid.innerHTML =
    filteredGalleryPhotos
      .map(
        (
          photo,
          index
        ) => `

          <button
            class="gallery-item"

            type="button"

            data-gallery-index="${index}"

            aria-label="
              Ver fotografía:
              ${photo.titulo || ""}
            "
          >

            <img
              src="${photo.imagen}"

              alt="${photo.titulo || "Colegio Henri Fayol"}"

              loading="lazy"
            >


            <div
              class="gallery-item-overlay"
            >

              <span>
                ${photo.categoria || ""}
              </span>


              <h3>
                ${photo.titulo || ""}
              </h3>

            </div>

          </button>

        `
      )
      .join("");


  document
    .querySelectorAll(
      "[data-gallery-index]"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            openGalleryPhoto(

              Number(
                button.dataset
                  .galleryIndex
              )

            );

          }
        );

      }
    );

}


/* =========================================
   ABRIR FOTO
========================================= */

function openGalleryPhoto(
  index
) {

  if (
    !filteredGalleryPhotos.length
  ) {

    return;

  }


  currentGalleryIndex =
    index;


  updateGalleryLightbox();


  const lightbox =
    document.getElementById(
      "gallery-lightbox"
    );


  lightbox.classList.add(
    "open"
  );


  lightbox.setAttribute(
    "aria-hidden",
    "false"
  );


  document.body.style.overflow =
    "hidden";

}


/* =========================================
   ACTUALIZAR LIGHTBOX
========================================= */

function updateGalleryLightbox() {

  const photo =
    filteredGalleryPhotos[
      currentGalleryIndex
    ];


  if (!photo) {
    return;
  }


  const image =
    document.getElementById(
      "gallery-lightbox-image"
    );


  image.src =
    photo.imagen;


  image.alt =
    photo.titulo
    ||
    "Colegio Henri Fayol";


  document.getElementById(
    "gallery-lightbox-category"
  ).textContent =
    photo.categoria || "";


  document.getElementById(
    "gallery-lightbox-title"
  ).textContent =
    photo.titulo || "";


  document.getElementById(
    "gallery-lightbox-count"
  ).textContent =
    `${
      currentGalleryIndex + 1
    } / ${
      filteredGalleryPhotos.length
    }`;

}


/* =========================================
   CAMBIAR FOTO
========================================= */

function moveGallery(
  direction
) {

  const total =
    filteredGalleryPhotos.length;


  if (!total) {
    return;
  }


  currentGalleryIndex =
    (
      currentGalleryIndex
      +
      direction
      +
      total
    )
    %
    total;


  updateGalleryLightbox();

}


/* =========================================
   CERRAR
========================================= */

function closeGalleryLightbox() {

  const lightbox =
    document.getElementById(
      "gallery-lightbox"
    );


  lightbox.classList.remove(
    "open"
  );


  lightbox.setAttribute(
    "aria-hidden",
    "true"
  );


  document.body.style.overflow =
    "";

}


/* =========================================
   INICIO
========================================= */

async function initializeGallery() {

  try {

    galleryPhotos =
      await loadGalleryData();


    filteredGalleryPhotos =
      [...galleryPhotos];


    renderGalleryFilters();

    renderGallery();


    document.getElementById(
      "gallery-lightbox-close"
    ).addEventListener(
      "click",
      closeGalleryLightbox
    );


    document.getElementById(
      "gallery-lightbox-background"
    ).addEventListener(
      "click",
      closeGalleryLightbox
    );


    document.getElementById(
      "gallery-prev"
    ).addEventListener(
      "click",
      () => {

        moveGallery(-1);

      }
    );


    document.getElementById(
      "gallery-next"
    ).addEventListener(
      "click",
      () => {

        moveGallery(1);

      }
    );


    document.addEventListener(
      "keydown",
      event => {

        const open =
          document
            .getElementById(
              "gallery-lightbox"
            )
            .classList
            .contains(
              "open"
            );


        if (!open) {
          return;
        }


        if (
          event.key
          ===
          "Escape"
        ) {

          closeGalleryLightbox();

        }


        if (
          event.key
          ===
          "ArrowLeft"
        ) {

          moveGallery(-1);

        }


        if (
          event.key
          ===
          "ArrowRight"
        ) {

          moveGallery(1);

        }

      }
    );

  }

  catch (error) {

    console.error(
      "Error cargando galería:",
      error
    );

  }

}


document.addEventListener(
  "DOMContentLoaded",
  initializeGallery
);