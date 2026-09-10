let admissionData = null;


/* =========================================
   CARGAR INFORMACIÓN
========================================= */

async function loadAdmissionData() {

  const response =
    await fetch(
      "data/admision.json"
    );


  if (!response.ok) {

    throw new Error(
      "No se pudo cargar admision.json"
    );

  }


  return await response.json();

}


/* =========================================
   INFORMACIÓN GENERAL
========================================= */

function renderAdmissionInformation() {

  const data =
    admissionData;


  document.getElementById(
    "admission-hero-label"
  ).textContent =
    data.hero.etiqueta;


  document.getElementById(
    "admission-hero-title"
  ).textContent =
    data.hero.titulo;


  document.getElementById(
    "admission-hero-description"
  ).textContent =
    data.hero.descripcion;


  document.getElementById(
    "admission-intro-label"
  ).textContent =
    data.introduccion.etiqueta;


  document.getElementById(
    "admission-intro-title"
  ).textContent =
    data.introduccion.titulo;


  document.getElementById(
    "admission-intro-description"
  ).textContent =
    data.introduccion.descripcion;


  document.getElementById(
    "admission-contact-title"
  ).textContent =
    data.contacto.titulo;


  document.getElementById(
    "admission-contact-description"
  ).textContent =
    data.contacto.descripcion;


  const email =
    document.getElementById(
      "admission-contact-email"
    );


  email.textContent =
    data.contacto.correo;


  email.href =
    `mailto:${data.contacto.correo}`;


  document.getElementById(
    "admission-contact-address"
  ).textContent =
    data.contacto.direccion;

}


/* =========================================
   PASOS
========================================= */

function renderAdmissionSteps() {

  const container =
    document.getElementById(
      "admission-steps"
    );


  container.innerHTML =
    admissionData.pasos
      .map(
        paso => {

          const description =
            paso.descripcion

              ? `
                <p>
                  ${paso.descripcion}
                </p>
              `

              : "";


          return `

            <article
              class="admission-step"
            >

              <div
                class="admission-step-number"
              >
                ${paso.numero}
              </div>


              <div
                class="admission-step-card"
              >

                <span>
                  Paso ${paso.numero}
                </span>


                <h3>
                  ${paso.titulo}
                </h3>


                ${description}

              </div>

            </article>

          `;

        }
      )
      .join("");

}


/* =========================================
   DOCUMENTOS
========================================= */

function renderDocuments() {

  const container =
    document.getElementById(
      "documents-grid"
    );


  container.innerHTML =
    admissionData.documentos
      .map(
        documento => `

          <article
            class="document-card"
          >

            <div class="document-icon">
              PDF
            </div>


            <div class="document-info">

              <h3>
                ${documento.titulo}
              </h3>


              <p>
                ${documento.descripcion}
              </p>


              <div class="document-actions">

                <button
                  class="document-view"
                  type="button"

                  data-document-id="${documento.id}"
                >
                  Ver documento
                </button>


                <a
                  href="${documento.archivo}"

                  download

                  class="document-download"
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
      ".document-view"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            openPDF(
              button.dataset.documentId
            );

          }
        );

      }
    );

}


/* =========================================
   VISOR PDF
========================================= */

function openPDF(
  id
) {

  const documentData =
    admissionData.documentos
      .find(
        documento =>
          documento.id === id
      );


  if (!documentData) {
    return;
  }


  const modal =
    document.getElementById(
      "pdf-modal"
    );


  const viewer =
    document.getElementById(
      "pdf-viewer"
    );


  const title =
    document.getElementById(
      "pdf-modal-title"
    );


  const externalLink =
    document.getElementById(
      "pdf-open-tab"
    );


  title.textContent =
    documentData.titulo;


  viewer.src =
    documentData.archivo;


  externalLink.href =
    documentData.archivo;


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


/* =========================================
   CERRAR PDF
========================================= */

function closePDF() {

  const modal =
    document.getElementById(
      "pdf-modal"
    );


  const viewer =
    document.getElementById(
      "pdf-viewer"
    );


  modal.classList.remove(
    "open"
  );


  modal.setAttribute(
    "aria-hidden",
    "true"
  );


  viewer.src = "";


  document.body.style.overflow =
    "";

}


/* =========================================
   INICIAR
========================================= */

async function initializeAdmission() {

  try {

    admissionData =
      await loadAdmissionData();


    renderAdmissionInformation();

    renderAdmissionSteps();

    renderDocuments();


    document.getElementById(
      "pdf-close"
    ).addEventListener(
      "click",
      closePDF
    );


    document.getElementById(
      "pdf-modal-background"
    ).addEventListener(
      "click",
      closePDF
    );


    document.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Escape"
        ) {

          closePDF();

        }

      }
    );

  }

  catch (error) {

    console.error(
      "Error cargando Admisión:",
      error
    );

  }

}


document.addEventListener(
  "DOMContentLoaded",
  initializeAdmission
);