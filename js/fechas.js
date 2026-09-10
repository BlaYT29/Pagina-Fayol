let importantDates = [];

let currentDatesFilter =
  "proximas";


/* =========================================
   CARGAR
========================================= */

async function loadDates() {

  const response =
    await fetch(
      "data/fechas.json"
    );


  if (!response.ok) {

    throw new Error(
      "No se pudo cargar fechas.json"
    );

  }


  return await response.json();

}


/* =========================================
   FECHAS
========================================= */

function createLocalDate(
  value
) {

  if (!value) {
    return null;
  }


  return new Date(
    value + "T12:00:00"
  );

}


function getToday() {

  const today =
    new Date();


  today.setHours(
    0,
    0,
    0,
    0
  );


  return today;

}


function getMonth(
  date
) {

  return date
    .toLocaleDateString(
      "es-CL",
      {
        month: "short"
      }
    )
    .replace(".", "")
    .toUpperCase();

}


/* =========================================
   PRÓXIMA FECHA
========================================= */

function renderNextDate() {

  const container =
    document.getElementById(
      "next-date-content"
    );


  const today =
    getToday();


  const upcoming =
    importantDates

      .filter(
        item => {

          const date =
            createLocalDate(
              item.fecha
            );


          return (
            date
            &&
            date >= today
            &&
            item.estado
            !==
            "pendiente"
          );

        }
      )

      .sort(
        (
          a,
          b
        ) =>

          createLocalDate(a.fecha)
          -
          createLocalDate(b.fecha)
      );


  if (!upcoming.length) {

    container.innerHTML = `

      <h3>
        Próximamente
      </h3>

      <p>
        Nuevas fechas serán publicadas
        próximamente.
      </p>

    `;

    return;

  }


  const item =
    upcoming[0];


  const date =
    createLocalDate(
      item.fecha
    );


  container.innerHTML = `

    <div class="next-date-date">

      <strong>
        ${date.getDate()}
      </strong>

      <span>
        ${getMonth(date)}
      </span>

    </div>


    <h3>
      ${item.titulo}
    </h3>


    <p>
      ${item.descripcion || ""}
    </p>

  `;

}


/* =========================================
   FILTROS
========================================= */

function getFilteredDates() {

  const today =
    getToday();


  let dates =
    [...importantDates];


  if (
    currentDatesFilter
    ===
    "proximas"
  ) {

    dates =
      dates.filter(
        item => {

          const date =
            createLocalDate(
              item.fecha
            );


          return (
            !date
            ||
            date >= today
          );

        }
      );

  }


  else if (
    currentDatesFilter
    !==
    "todas"
  ) {

    dates =
      dates.filter(
        item =>
          item.categoria
          ===
          currentDatesFilter
      );

  }


  return dates.sort(
    (
      a,
      b
    ) => {

      if (!a.fecha) {
        return 1;
      }


      if (!b.fecha) {
        return -1;
      }


      return (
        createLocalDate(a.fecha)
        -
        createLocalDate(b.fecha)
      );

    }
  );

}


/* =========================================
   MOSTRAR FECHA
========================================= */

function createDateVisual(
  item
) {

  if (!item.fecha) {

    return `

      <div class="date-main">

        <strong>
          Por confirmar
        </strong>

      </div>

    `;

  }


  const start =
    createLocalDate(
      item.fecha
    );


  if (item.fechaFin) {

    const end =
      createLocalDate(
        item.fechaFin
      );


    return `

      <div
        class="
          date-main
          date-range
        "
      >

        <strong>
          ${start.getDate()}
          ${getMonth(start)}
        </strong>

        <span>
          al
        </span>

        <strong>
          ${end.getDate()}
          ${getMonth(end)}
        </strong>

      </div>

    `;

  }


  return `

    <div class="date-main">

      <strong>
        ${start.getDate()}
      </strong>

      <span>
        ${getMonth(start)}
      </span>

    </div>

  `;

}


/* =========================================
   RENDER
========================================= */

function renderDates() {

  const container =
    document.getElementById(
      "dates-list"
    );


  const dates =
    getFilteredDates();


  if (!dates.length) {

    container.innerHTML = `

      <div class="dates-empty">

        No hay fechas registradas
        para esta categoría.

      </div>

    `;

    return;

  }


  const today =
    getToday();


  container.innerHTML =
    dates
      .map(
        item => {

          const date =
            createLocalDate(
              item.fecha
            );


          const isPast =
            date
            &&
            date < today;


          const pending =
            item.estado
            ===
            "pendiente";


          return `

            <article
              class="
                date-row

                ${
                  isPast
                    ? "past"
                    : ""
                }

                ${
                  pending
                    ? "pending"
                    : ""
                }
              "
            >

              ${createDateVisual(item)}


              <div class="date-info">

                <h3>
                  ${item.titulo}
                </h3>


                <p>
                  ${item.descripcion || ""}
                </p>

              </div>


              <span class="date-category">

                ${item.categoria}

              </span>

            </article>

          `;

        }
      )
      .join("");

}


/* =========================================
   BOTONES
========================================= */

function initializeFilters() {

  document
    .querySelectorAll(
      ".dates-filter"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            currentDatesFilter =
              button.dataset.filter;


            document
              .querySelectorAll(
                ".dates-filter"
              )
              .forEach(
                item =>
                  item.classList
                    .remove("active")
              );


            button.classList
              .add("active");


            renderDates();

          }
        );

      }
    );

}


/* =========================================
   INICIO
========================================= */

async function initializeDatesPage() {

  try {

    importantDates =
      await loadDates();


    renderNextDate();

    renderDates();

    initializeFilters();

  }

  catch (error) {

    console.error(
      "Error cargando fechas:",
      error
    );

  }

}


document.addEventListener(
  "DOMContentLoaded",
  initializeDatesPage
);