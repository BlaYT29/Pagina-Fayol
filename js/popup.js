async function initializePopup() {

  try {

    const response =
      await fetch("data/popup.json");


    if (!response.ok) {
      throw new Error(
        "No se pudo cargar popup.json"
      );
    }


    const data =
      await response.json();


    if (!data.activo) {
      return;
    }


    const storageKey =
      `popup-${data.id}`;


    if (
      data.mostrarUnaVez &&
      sessionStorage.getItem(storageKey)
    ) {
      return;
    }


    createPopup(
      data,
      storageKey
    );

  }

  catch (error) {

    console.error(
      "Error cargando popup:",
      error
    );

  }

}



function createPopup(
  data,
  storageKey
) {

  const popup =
    document.createElement("div");


  popup.className =
    "school-popup";


  popup.innerHTML = `

    <div class="school-popup-backdrop"></div>


    <div
      class="school-popup-window"
      role="dialog"
      aria-modal="true"
      aria-labelledby="school-popup-title"
    >


      <button
        class="school-popup-close"
        type="button"
        aria-label="Cerrar"
      >
        ×
      </button>


      <div class="school-popup-image">

        ${
          data.imagen
            ? `
              <img
                src="${data.imagen}"
                alt="Admisión Escolar 2027 - Colegio Henri Fayol"
              >
            `
            : ""
        }

      </div>


      <div class="school-popup-content">

        ${
          data.etiqueta
            ? `
              <span class="school-popup-label">
                ${data.etiqueta}
              </span>
            `
            : ""
        }


        <h2 id="school-popup-title">
          ${data.titulo || ""}
        </h2>


        <p>
          ${data.descripcion || ""}
        </p>


        <div class="school-popup-actions">

          ${
            data.boton?.texto &&
            data.boton?.link
              ? `
                <a
                  href="${data.boton.link}"
                  class="school-popup-primary"
                >
                  ${data.boton.texto}
                </a>
              `
              : ""
          }


          ${
            data.botonSecundario?.texto &&
            data.botonSecundario?.link
              ? `
                <a
                  href="${data.botonSecundario.link}"
                  class="school-popup-secondary"
                >
                  ${data.botonSecundario.texto}
                </a>
              `
              : ""
          }

        </div>

      </div>


    </div>

  `;


  document.body.appendChild(
    popup
  );


  requestAnimationFrame(
    () => {
      popup.classList.add("visible");
    }
  );


  const closeButton =
    popup.querySelector(
      ".school-popup-close"
    );


  const backdrop =
    popup.querySelector(
      ".school-popup-backdrop"
    );


  const links =
    popup.querySelectorAll("a");


  function rememberPopup() {

    if (data.mostrarUnaVez) {

      sessionStorage.setItem(
        storageKey,
        "true"
      );

    }

  }


  function closePopup() {

    rememberPopup();


    popup.classList.remove(
      "visible"
    );


    setTimeout(
      () => popup.remove(),
      300
    );

  }


  closeButton.addEventListener(
    "click",
    closePopup
  );


  backdrop.addEventListener(
    "click",
    closePopup
  );


  links.forEach(
    link => {

      link.addEventListener(
        "click",
        rememberPopup
      );

    }
  );


  document.addEventListener(
    "keydown",
    function handleEscape(event) {

      if (event.key === "Escape") {

        closePopup();


        document.removeEventListener(
          "keydown",
          handleEscape
        );

      }

    }
  );

}



document.addEventListener(
  "DOMContentLoaded",
  initializePopup
);