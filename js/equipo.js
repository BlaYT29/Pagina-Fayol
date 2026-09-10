let teamMembers = [];

let currentView =
  "coordinacion";

let selectedCourse =
  "Todos";


const teamViews = [
  {
    id: "coordinacion",
    nombre: "Equipo de Coordinación"
  },
  {
    id: "basica",
    nombre: "Enseñanza Básica"
  },
  {
    id: "media",
    nombre: "Enseñanza Media"
  },
  {
    id: "jefaturas",
    nombre: "Profesores Jefes"
  }
];


const schoolCourses = [
  "Todos",

  "1° Básico",
  "2° Básico",
  "3° Básico",
  "4° Básico",
  "5° Básico",
  "6° Básico",
  "7° Básico",
  "8° Básico",

  "1° Medio",
  "2° Medio",
  "3° Medio",
  "4° Medio"
];



/* =========================================
   CARGAR JSON
========================================= */

async function loadTeamData() {

  const response =
    await fetch(
      "data/profesores.json"
    );


  if (!response.ok) {

    throw new Error(
      "No fue posible cargar profesores.json"
    );

  }


  return await response.json();

}



/* =========================================
   INICIALES
========================================= */

function getInitials(
  name
) {

  if (!name) {
    return "HF";
  }


  const words =
    name
      .trim()
      .split(/\s+/);


  if (
    words.length === 1
  ) {

    return words[0]
      .substring(0,2)
      .toUpperCase();

  }


  return (
    words[0][0]
    +
    words[
      words.length - 1
    ][0]
  ).toUpperCase();

}



/* =========================================
   TABS
========================================= */

function renderTabs() {

  const container =
    document.getElementById(
      "team-tabs"
    );


  container.innerHTML =
    teamViews
      .map(
        view => `

          <button
            class="
              team-tab
              ${
                currentView
                === view.id

                  ? "active"

                  : ""
              }
            "

            data-view="${view.id}"
          >

            ${view.nombre}

          </button>

        `
      )
      .join("");


  document
    .querySelectorAll(
      ".team-tab"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            currentView =
              button.dataset.view;


            selectedCourse =
              "Todos";


            renderTabs();

            renderCourseFilter();

            renderTeam();

          }
        );

      }
    );

}



/* =========================================
   FILTRO JEFATURAS
========================================= */

function renderCourseFilter() {

  const container =
    document.getElementById(
      "course-filter"
    );


  if (
    currentView
    !==
    "jefaturas"
  ) {

    container.classList
      .remove(
        "visible"
      );


    container.innerHTML =
      "";


    return;

  }


  container.classList
    .add(
      "visible"
    );


  container.innerHTML =
    schoolCourses
      .map(
        course => `

          <button
            class="
              course-button

              ${
                selectedCourse
                === course

                  ? "active"

                  : ""
              }
            "

            data-course="${course}"
          >

            ${course}

          </button>

        `
      )
      .join("");


  document
    .querySelectorAll(
      ".course-button"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            selectedCourse =
              button.dataset.course;


            renderCourseFilter();

            renderTeam();

          }
        );

      }
    );

}



/* =========================================
   FILTRAR PERSONAS
========================================= */

function getFilteredPeople() {

  let people = [];


  if (
    currentView
    ===
    "coordinacion"
  ) {

    people =
      teamMembers.filter(
        person =>
          person.tipo
          ===
          "coordinacion"
      );

  }


  if (
    currentView
    ===
    "basica"
  ) {

    people =
      teamMembers.filter(
        person =>
          person.tipo
          ===
          "docente"

          &&

          (
            person.nivel
            ===
            "Básica"

            ||

            person.nivel
            ===
            "Básica y Media"
          )
      );

  }


  if (
    currentView
    ===
    "media"
  ) {

    people =
      teamMembers.filter(
        person =>
          person.tipo
          ===
          "docente"

          &&

          (
            person.nivel
            ===
            "Media"

            ||

            person.nivel
            ===
            "Básica y Media"
          )
      );

  }


  if (
    currentView
    ===
    "jefaturas"
  ) {

    people =
      teamMembers.filter(
        person =>
          person.tipo
          ===
          "docente"

          &&

          person.jefatura
      );


    if (
      selectedCourse
      !==
      "Todos"
    ) {

      people =
        people.filter(
          person =>
            person.jefatura
            ===
            selectedCourse
        );

    }

  }


  return people.sort(
    (
      a,
      b
    ) =>

      (
        a.orden
        || 999
      )

      -

      (
        b.orden
        || 999
      )
  );

}



/* =========================================
   TÍTULO SECCIÓN
========================================= */

function getViewName() {

  const view =
    teamViews.find(
      item =>
        item.id
        ===
        currentView
    );


  return view
    ? view.nombre
    : "Nuestro equipo";

}



/* =========================================
   TARJETA PERSONA
========================================= */

function createPersonCard(
  person
) {

  const fullName =
    person.tratamiento

      ? `${person.tratamiento} ${person.nombre}`

      : person.nombre;


  const photo =

    person.foto

      ? `

        <img
          src="${person.foto}"
          alt="${fullName}"
          loading="lazy"
        >

      `

      : `

        <div
          class="
            person-placeholder
          "
        >

          <div
            class="
              person-initials
            "
          >

            ${getInitials(
              person.nombre
            )}

          </div>

        </div>

      `;


  let tag = "";


  if (
    person.tipo
    ===
    "coordinacion"
  ) {

    tag =
      "Equipo de Coordinación";

  }

  else {

    tag =
      person.nivel || "Docente";

  }


  const subject =

    person.asignatura

      ? `

        <p
          class="person-subject"
        >
          ${person.asignatura}
        </p>

      `

      : "";


  const jefatura =

    person.jefatura

      ? `

        <div
          class="
            person-headteacher
          "
        >

          Jefatura ${person.jefatura}

        </div>

      `

      : "";


  const email =

    person.correo

      ? `

        <a
          href="mailto:${person.correo}"
          class="person-email"
        >

          ${person.correo}

        </a>

      `

      : "";


  return `

    <article
      class="
        person-card

        ${
          person.tipo
          ===
          "coordinacion"

            ? "coordinator"

            : ""
        }
      "
    >

      <div
        class="person-photo"
      >

        ${photo}

      </div>


      <div
        class="person-content"
      >

        <span
          class="person-tag"
        >
          ${tag}
        </span>


        <h3>
          ${fullName}
        </h3>


        <p
          class="person-role"
        >
          ${person.cargo}
        </p>


        ${subject}

        ${jefatura}

        ${email}

      </div>

    </article>

  `;

}



/* =========================================
   MOSTRAR EQUIPO
========================================= */

function renderTeam() {

  const grid =
    document.getElementById(
      "team-grid"
    );


  const header =
    document.getElementById(
      "team-results-header"
    );


  const people =
    getFilteredPeople();


  let title =
    getViewName();


  if (
    currentView
    ===
    "jefaturas"

    &&

    selectedCourse
    !==
    "Todos"
  ) {

    title =
      `Jefatura ${selectedCourse}`;

  }


  header.innerHTML = `

    <h3>
      ${title}
    </h3>

    <span>

      ${people.length}

      ${
        people.length === 1
          ? "integrante"
          : "integrantes"
      }

    </span>

  `;


  grid.classList.toggle(
    "coordination",

    currentView
    ===
    "coordinacion"
  );


  if (
    people.length === 0
  ) {

    grid.innerHTML = `

      <div
        class="team-empty"
      >

        <strong>
          Información próximamente
        </strong>

        <p>
          Aún no se ha registrado
          información para esta sección.
        </p>

      </div>

    `;


    return;

  }


  grid.innerHTML =
    people
      .map(
        createPersonCard
      )
      .join("");

}



/* =========================================
   INICIO
========================================= */

async function initializeTeam() {

  try {

    teamMembers =
      await loadTeamData();


    renderTabs();

    renderCourseFilter();

    renderTeam();

  }

  catch (
    error
  ) {

    console.error(
      error
    );


    document.getElementById(
      "team-grid"
    ).innerHTML = `

      <div
        class="team-empty"
      >

        <strong>
          Error al cargar el equipo
        </strong>

        <p>
          Revisa el archivo
          data/profesores.json.
        </p>

      </div>

    `;

  }

}



document.addEventListener(
  "DOMContentLoaded",
  initializeTeam
);