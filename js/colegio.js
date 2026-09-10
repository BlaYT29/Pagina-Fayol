let schoolInstitutionalData = null;


/* =========================================
   CARGAR DATOS
========================================= */

async function loadSchoolInstitutionalData() {

  const response =
    await fetch(
      "data/colegio.json"
    );


  if (!response.ok) {

    throw new Error(
      "No se pudo cargar colegio.json"
    );

  }


  return await response.json();

}


/* =========================================
   PRESENTACIÓN
========================================= */

function renderSchoolAbout() {

  const info =
    schoolInstitutionalData
      .institucional
      .presentacion;


  document.getElementById(
    "school-about-title"
  ).textContent =
    info.titulo;


  const textContainer =
    document.getElementById(
      "school-about-text"
    );


  textContainer.innerHTML =
    info.texto
      .map(
        paragraph => `

          <p>
            ${paragraph}
          </p>

        `
      )
      .join("");

}


/* =========================================
   MISIÓN Y VISIÓN
========================================= */

function renderPurpose() {

  document.getElementById(
    "school-mission"
  ).textContent =
    schoolInstitutionalData
      .institucional
      .mision;


  document.getElementById(
    "school-vision"
  ).textContent =
    schoolInstitutionalData
      .institucional
      .vision;

}


/* =========================================
   PROYECTO
========================================= */

function renderProject() {

  const project =
    schoolInstitutionalData
      .institucional
      .proyectoEducativo;


  document.getElementById(
    "school-project-title"
  ).textContent =
    project.titulo;


  document.getElementById(
    "school-project-text"
  ).textContent =
    project.texto;

}


/* =========================================
   VALORES
========================================= */

function renderValues() {

  const container =
    document.getElementById(
      "school-values-grid"
    );


  const values =
    schoolInstitutionalData
      .institucional
      .valores;


  container.innerHTML =
    values
      .map(
        (
          value,
          index
        ) => `

          <article
            class="school-value-card"
          >

            <span
              class="school-value-number"
            >

              0${index + 1}

            </span>


            <h3>
              ${value.titulo}
            </h3>


            <p>
              ${value.descripcion}
            </p>

          </article>

        `
      )
      .join("");

}


/* =========================================
   INICIAR
========================================= */

async function initializeSchoolPage() {

  try {

    schoolInstitutionalData =
      await loadSchoolInstitutionalData();


    renderSchoolAbout();

    renderPurpose();

    renderProject();

    renderValues();

  }

  catch (error) {

    console.error(
      "Error cargando información del colegio:",
      error
    );

  }

}


document.addEventListener(
  "DOMContentLoaded",
  initializeSchoolPage
);