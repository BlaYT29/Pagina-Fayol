let informationData = null;

let currentDocumentFilter =
  "Todos";


/* =========================================
   CARGAR
========================================= */

async function loadInformationData() {

  const response =
    await fetch(
      "data/informacion.json"
    );


  if (!response.ok) {

    throw new Error(
      "No se pudo cargar informacion.json"
    );

  }


  return await response.json();

}


/* =========================================
   HORARIOS
========================================= */

function renderSchedules() {

  const container =
    document.getElementById(
      "schedule-grid"
    );


  container.innerHTML =
    informationData.horarios
      .map(
        horario => `

          <article
            class="schedule-card"
          >

            <div>

              <span class="schedule-type">
                ${horario.subtitulo}
              </span>


              <h3>
                ${horario.titulo}
              </h3>

            </div>


            <div class="schedule-time">

              <strong>
                ${horario.desde}
                —
                ${horario.hasta}
              </strong>


              <span>
                ${horario.dias}
              </span>

            </div>

          </article>

        `
      )
      .join("");


  document.getElementById(
    "schedule-message"
  ).textContent =
    informationData.mensajeHorarios;

}


/* =========================================
   FILTROS DOCUMENTOS
========================================= */

function renderDocumentFilters() {

  const container =
    document.getElementById(
      "document-filters"
    );


  const categories = [

    "Todos",

    ...new Set(

      informationData.documentos.map(
        documento =>
          documento.categoria
      )

    )

  ];


  container.innerHTML =
    categories
      .map(
        category => `

          <button
            type="button"

            class="
              document-filter

              ${
                currentDocumentFilter
                ===
                category

                  ? "active"

                  : ""
              }
            "

            data-category="${category}"
          >

            ${category}

          </button>

        `
      )
      .join("");


  document
    .querySelectorAll(
      ".document-filter"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            currentDocumentFilter =
              button.dataset.category;


            renderDocumentFilters();

            renderDocuments();

          }
        );

      }
    );

}


/* =========================================
   DOCUMENTOS
========================================= */

function getFilteredDocuments() {

  if (
    currentDocumentFilter
    ===
    "Todos"
  ) {

    return informationData.documentos;

  }


  return informationData.documentos
    .filter(
      documento =>
        documento.categoria
        ===
        currentDocumentFilter
    );

}


function renderDocuments() {

  const container =
    document.getElementById(
      "info-documents-grid"
    );


  const documents =
    getFilteredDocuments();


  container.innerHTML =
    documents
      .map(
        documento => `

          <article
            class="info-document-card"
          >

            <div
              class="info-document-icon"
            >
              PDF
            </div>


            <div
              class="info-document-content"
            >

              <span
                class="info-document-category"
              >
                ${documento.categoria}
              </span>


              <h3>
                ${documento.titulo}
              </h3>


              <p>
                ${documento.descripcion}
              </p>


              <div
                class="info-document-actions"
              >

                <button
                  type="button"

                  class="info-document-view"

                  data-document-id="${documento.id}"
                >
                  Ver documento
                </button>


                <a
                  href="${documento.archivo}"

                  download

                  class="info-document-download"
                >
                  Descargar PDF ↓
                </a>

              </div>

            </div>

          </article>

        `
      )
      .join("");


  document
    .querySelectorAll(
      ".info-document-view"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            openInformationPDF(
              button.dataset.documentId
            );

          }
        );

      }
    );

}


/* =========================================
   PDF
========================================= */

function openInformationPDF(
  id
) {

  const documento =
    informationData.documentos
      .find(
        item =>
          item.id === id
      );


  if (!documento) {
    return;
  }


  document.getElementById(
    "info-pdf-title"
  ).textContent =
    documento.titulo;


  document.getElementById(
    "info-pdf-viewer"
  ).src =
    documento.archivo;


  document.getElementById(
    "info-pdf-new-tab"
  ).href =
    documento.archivo;


  const modal =
    document.getElementById(
      "info-pdf-modal"
    );


  modal.classList.add(
    "open"
  );


  modal.setAttribute(
    "aria-hidden",
    "false"
  );


  document.body.style.overflow =
    "hidden";

}


function closeInformationPDF() {

  const modal =
    document.getElementById(
      "info-pdf-modal"
    );


  modal.classList.remove(
    "open"
  );


  modal.setAttribute(
    "aria-hidden",
    "true"
  );


  document.getElementById(
    "info-pdf-viewer"
  ).src =
    "";


  document.body.style.overflow =
    "";

}


/* =========================================
   INICIO
========================================= */

async function initializeInformationPage() {

  try {

    informationData =
      await loadInformationData();


    renderSchedules();

    renderDocumentFilters();

    renderDocuments();


    document.getElementById(
      "info-pdf-close"
    ).addEventListener(
      "click",
      closeInformationPDF
    );


    document.getElementById(
      "info-pdf-background"
    ).addEventListener(
      "click",
      closeInformationPDF
    );


    document.addEventListener(
      "keydown",
      event => {

        if (
          event.key
          ===
          "Escape"
        ) {

          closeInformationPDF();

        }

      }
    );

  }

  catch (error) {

    console.error(
      "Error cargando Información:",
      error
    );

  }

}


document.addEventListener(
  "DOMContentLoaded",
  initializeInformationPage
);