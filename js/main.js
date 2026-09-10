/* =========================================================
   CARGAR COMPONENTES
========================================================= */

async function loadComponent(
  elementId,
  path
) {

  const element =
    document.getElementById(
      elementId
    );


  if (!element) {
    return;
  }


  try {

    const response =
      await fetch(path);


    if (!response.ok) {

      throw new Error(
        `No se pudo cargar ${path}`
      );

    }


    element.innerHTML =
      await response.text();

  }


  catch (error) {

    console.error(
      error
    );

  }

}



/* =========================================================
   TELÉFONO
========================================================= */

function createPhoneLink(
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


  if (
    digits.length === 9
  ) {

    return `+56${digits}`;

  }


  return digits;

}



/* =========================================================
   FOOTER
========================================================= */

async function loadFooterData() {

  try {

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


    const school =
      await schoolResponse.json();


    const information =
      await informationResponse.json();


    const contact =
      school.contacto || {};


    /* =====================================
       DIRECCIÓN
    ===================================== */

    const address =
      contact.direccion || "";


    const addressLink =
      document.getElementById(
        "footer-address"
      );


    const locationAddress =
      document.getElementById(
        "footer-location-address"
      );


    const directions =
      document.getElementById(
        "footer-directions"
      );


    if (address) {

      const mapsQuery =
        encodeURIComponent(
          `${address}, Chile`
        );


      if (addressLink) {

        addressLink.textContent =
          address;


        addressLink.href =
          `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

      }


      if (locationAddress) {

        locationAddress.textContent =
          address;

      }


      if (directions) {

        directions.href =
          `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

      }

    }



    /* =====================================
       CORREO
    ===================================== */

    const email =
      document.getElementById(
        "footer-email"
      );


    if (
      email
      &&
      contact.correo
    ) {

      email.textContent =
        contact.correo;


      email.href =
        `mailto:${contact.correo}`;

    }



    /* =====================================
       TELÉFONOS
    ===================================== */

    const phone1 =
      document.getElementById(
        "footer-phone-1"
      );


    if (
      phone1
      &&
      contact.telefono1
    ) {

      phone1.textContent =
        contact.telefono1;


      phone1.href =
        `tel:${createPhoneLink(
          contact.telefono1
        )}`;

    }


    const phone2 =
      document.getElementById(
        "footer-phone-2"
      );


    if (
      phone2
      &&
      contact.telefono2
    ) {

      phone2.textContent =
        contact.telefono2;


      phone2.href =
        `tel:${createPhoneLink(
          contact.telefono2
        )}`;

    }



    /* =====================================
       HORARIOS
    ===================================== */

    const schoolHours =
      information.horarios
        .find(
          item =>
            item.id === "colegio"
        );


    const summerHours =
      information.horarios
        .find(
          item =>
            item.id ===
            "colegio-verano"
        );


    if (schoolHours) {

      const element =
        document.getElementById(
          "footer-school-hours"
        );


      if (element) {

        element.textContent =
          `${schoolHours.desde} — ${schoolHours.hasta}`;

      }

    }


    if (summerHours) {

      const element =
        document.getElementById(
          "footer-summer-hours"
        );


      if (element) {

        element.textContent =
          `${summerHours.desde} — ${summerHours.hasta}`;

      }

    }



    /* =====================================
       REDES SOCIALES
    ===================================== */

    const socialContainer =
      document.getElementById(
        "footer-socials"
      );


    const socialNetworks = [

      {
        id:
          "footer-instagram",

        url:
          school.redes?.instagram
      },

      {
        id:
          "footer-facebook",

        url:
          school.redes?.facebook
      },

      {
        id:
          "footer-youtube",

        url:
          school.redes?.youtube
      }

    ];


    let visibleSocialNetworks =
      0;


    socialNetworks.forEach(
      social => {

        const element =
          document.getElementById(
            social.id
          );


        if (!element) {
          return;
        }


        if (social.url) {

          element.href =
            social.url;


          element.style.display =
            "";


          visibleSocialNetworks++;

        }

        else {

          element.style.display =
            "none";

        }

      }
    );


    if (
      socialContainer
      &&
      visibleSocialNetworks === 0
    ) {

      socialContainer.style.display =
        "none";

    }



    /* =====================================
       AÑO
    ===================================== */

    const year =
      document.getElementById(
        "current-year"
      );


    if (year) {

      year.textContent =
        new Date().getFullYear();

    }

  }


  catch (error) {

    console.error(
      "Error cargando datos del footer:",
      error
    );

  }

}



/* =========================================================
   INICIAR COMPONENTES
========================================================= */

async function initializeWebsite() {

  await Promise.all([

    loadComponent(
      "header-container",
      "components/header.html"
    ),

    loadComponent(
      "footer-container",
      "components/footer.html"
    )

  ]);


  /*
    Header ya existe en el DOM,
    ahora podemos activarlo.
  */

  if (
    typeof initHeader ===
    "function"
  ) {

    initHeader();

  }


  await loadFooterData();

}



/* =========================================================
   INICIAR
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initializeWebsite
);