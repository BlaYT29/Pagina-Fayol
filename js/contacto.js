let contactSchoolData = null;

let contactInformationData = null;


/* =========================================
   CARGAR INFORMACIÓN
========================================= */

async function loadContactData() {

  const [
    schoolResponse,
    informationResponse
  ] = await Promise.all([

    fetch(
      "data/colegio.json"
    ),

    fetch(
      "data/informacion.json"
    )

  ]);


  if (!schoolResponse.ok) {

    throw new Error(
      "No se pudo cargar colegio.json"
    );

  }


  if (!informationResponse.ok) {

    throw new Error(
      "No se pudo cargar informacion.json"
    );

  }


  contactSchoolData =
    await schoolResponse.json();


  contactInformationData =
    await informationResponse.json();

}



/* =========================================
   LIMPIAR TELÉFONO
========================================= */

function getTelephoneLink(
  phone
) {

  if (!phone) {
    return "";
  }


  const digits =
    phone.replace(
      /\D/g,
      ""
    );


  /*
    Los números entregados son celulares
    chilenos de 9 dígitos.

    Para enlaces tel: agregamos +56
    automáticamente.
  */

  if (
    digits.length === 9
  ) {

    return `+56${digits}`;

  }


  return digits;

}



/* =========================================
   FORMAS DE CONTACTO
========================================= */

function renderContactOptions() {

  const container =
    document.getElementById(
      "contact-options-grid"
    );


  const contact =
    contactSchoolData.contacto;


  const options = [];


  /* CORREO */

  if (contact.correo) {

    options.push({

      titulo:
        "Correo electrónico",

      descripcion:
        "Para información, consultas generales o dudas sobre nuestro establecimiento.",

      link:
        `mailto:${contact.correo}`,

      linkText:
        contact.correo,

      external:
        false

    });

  }


  /* RECEPCIÓN */

  if (contact.telefono1) {

    options.push({

      titulo:
        contact.telefono1Nombre
        ||
        "Recepción",

      descripcion:
        "Comunícate telefónicamente con la recepción del Colegio Henri Fayol.",

      link:
        `tel:${getTelephoneLink(contact.telefono1)}`,

      linkText:
        contact.telefono1,

      external:
        false

    });

  }


  /* CONVIVENCIA ESCOLAR */

  if (contact.telefono2) {

    options.push({

      titulo:
        contact.telefono2Nombre
        ||
        "Convivencia Escolar",

      descripcion:
        "Línea de contacto correspondiente al área de Convivencia Escolar.",

      link:
        `tel:${getTelephoneLink(contact.telefono2)}`,

      linkText:
        contact.telefono2,

      external:
        false

    });

  }


  /* DIRECCIÓN */

  if (contact.direccion) {

    const query =
      encodeURIComponent(
        `${contact.direccion}, Chile`
      );


    options.push({

      titulo:
        "Visita la escuela",

      descripcion:
        "También puedes visitarnos presencialmente en nuestro establecimiento.",

      link:
        `https://www.google.com/maps/search/?api=1&query=${query}`,

      linkText:
        contact.direccion,

      external:
        true

    });

  }



  container.innerHTML =
    options
      .map(
        (
          option,
          index
        ) => `

          <article
            class="contact-option"
          >

            <span
              class="contact-option-index"
            >
              0${index + 1}
            </span>


            <div>

              <h3>
                ${option.titulo}
              </h3>


              <p>
                ${option.descripcion}
              </p>


              <a
                href="${option.link}"

                ${
                  option.external

                    ? `
                      target="_blank"
                      rel="noopener"
                    `

                    : ""
                }
              >
                ${option.linkText}
              </a>

            </div>

          </article>

        `
      )
      .join("");

}



/* =========================================
   HORARIOS DE OFICINA
========================================= */

function renderContactHours() {

  const container =
    document.getElementById(
      "contact-hours"
    );


  const officeSchedules =
    contactInformationData
      .horarios
      .filter(
        horario =>
          horario.id === "colegio"
          ||
          horario.id === "colegio-verano"
      );


  if (!officeSchedules.length) {

    container.innerHTML = `

      <p>
        Horarios próximamente.
      </p>

    `;

    return;

  }


  container.innerHTML =
    officeSchedules
      .map(
        horario => `

          <div
            class="contact-hour-row"
          >

            <span>
              ${horario.subtitulo}
            </span>


            <strong>

              ${horario.desde}
              —
              ${horario.hasta}

            </strong>


            <div
              class="contact-hour-days"
            >
              ${horario.dias}
            </div>

          </div>

        `
      )
      .join("");

}



/* =========================================
   MAPA
========================================= */

function renderContactMap() {

  const address =
    contactSchoolData
      .contacto
      .direccion;


  if (!address) {
    return;
  }


  const completeAddress =
    `${address}, Chile`;


  const query =
    encodeURIComponent(
      completeAddress
    );


  document.getElementById(
    "contact-location-address"
  ).textContent =
    address;


  document.getElementById(
    "contact-map-address"
  ).textContent =
    address;


  document.getElementById(
    "contact-map-frame"
  ).src =
    `https://www.google.com/maps?q=${query}&output=embed`;


  document.getElementById(
    "contact-directions"
  ).href =
    `https://www.google.com/maps/search/?api=1&query=${query}`;

}



/* =========================================
   FORMULARIO
========================================= */

function initializeContactForm() {

  const form =
    document.getElementById(
      "contact-form"
    );


  if (!form) {
    return;
  }


  const submitButton =
    document.getElementById(
      "contact-submit"
    );


  const status =
    document.getElementById(
      "contact-form-status"
    );


  form.addEventListener(
    "submit",
    async event => {

      event.preventDefault();


      if (!form.checkValidity()) {

        form.reportValidity();

        return;

      }


      const schoolEmail =
        contactSchoolData
          .contacto
          .correo;


      if (!schoolEmail) {

        status.className =
          "contact-form-status error";


        status.textContent =
          "El correo del colegio aún no se encuentra configurado.";


        return;

      }


      const name =
        document.getElementById(
          "contact-name"
        ).value.trim();


      const email =
        document.getElementById(
          "contact-email"
        ).value.trim();


      const phone =
        document.getElementById(
          "contact-phone"
        ).value.trim();


      const reason =
        document.getElementById(
          "contact-reason"
        ).value;


      const message =
        document.getElementById(
          "contact-message"
        ).value.trim();


      submitButton.disabled =
        true;


      submitButton.textContent =
        "Enviando...";


      status.className =
        "contact-form-status";


      status.textContent =
        "";


      try {

        const response =
          await fetch(

            `https://formsubmit.co/ajax/${schoolEmail}`,

            {

              method:
                "POST",

              headers: {

                "Content-Type":
                  "application/json",

                "Accept":
                  "application/json"

              },

              body:
                JSON.stringify({

                  nombre:
                    name,

                  email:
                    email,

                  telefono:
                    phone
                    ||
                    "No informado",

                  motivo:
                    reason,

                  mensaje:
                    message,

                  _subject:
                    `Nueva consulta web - ${reason}`,

                  _template:
                    "table"

                })

            }

          );


        const result =
          await response.json();


        if (!response.ok) {

          throw new Error(
            result.message
            ||
            "No fue posible enviar el mensaje."
          );

        }


        status.className =
          "contact-form-status success";


        status.innerHTML = `

          <strong>
            Consulta enviada correctamente.
          </strong>

          <span>
            Gracias por comunicarte con
            el Colegio Henri Fayol.
          </span>

        `;


        form.reset();

      }


      catch (error) {

        console.error(
          "Error enviando formulario:",
          error
        );


        status.className =
          "contact-form-status error";


        status.innerHTML = `

          <strong>
            No pudimos enviar tu consulta.
          </strong>

          <span>
            Intenta nuevamente o escríbenos directamente
            a ${schoolEmail}.
          </span>

        `;

      }


      finally {

        submitButton.disabled =
          false;


        submitButton.textContent =
          "Enviar consulta";

      }

    }

  );

}



/* =========================================
   INICIAR CONTACTO
========================================= */

async function initializeContactPage() {

  try {

    await loadContactData();


    renderContactOptions();

    renderContactHours();

    renderContactMap();

    initializeContactForm();

  }


  catch (error) {

    console.error(
      "Error cargando Contacto:",
      error
    );

  }

}



document.addEventListener(
  "DOMContentLoaded",
  initializeContactPage
);