function initHeader() {

  const header =
    document.getElementById(
      "main-header"
    );


  const menuButton =
    document.getElementById(
      "menu-button"
    );


  const nav =
    document.getElementById(
      "main-nav"
    );


  const dropdown =
    document.querySelector(
      ".nav-dropdown"
    );


  const dropdownButton =
    document.getElementById(
      "information-menu-button"
    );


  /* =====================================
     HEADER AL HACER SCROLL
  ===================================== */

  function updateHeaderScroll() {

    if (!header) {
      return;
    }


    if (
      window.scrollY > 20
    ) {

      header.classList.add(
        "scrolled"
      );

    }

    else {

      header.classList.remove(
        "scrolled"
      );

    }

  }


  updateHeaderScroll();


  window.addEventListener(
    "scroll",
    updateHeaderScroll
  );


  /* =====================================
     MENÚ CELULAR
  ===================================== */

  if (
    menuButton
    &&
    nav
  ) {

    menuButton.addEventListener(
      "click",
      () => {

        const isOpen =
          nav.classList.toggle(
            "active"
          );


        menuButton.classList.toggle(
          "active",
          isOpen
        );


        menuButton.setAttribute(
          "aria-expanded",
          String(isOpen)
        );


        if (!isOpen && dropdown) {

          dropdown.classList.remove(
            "open"
          );


          if (dropdownButton) {

            dropdownButton.setAttribute(
              "aria-expanded",
              "false"
            );

          }

        }

      }
    );

  }


  /* =====================================
     DROPDOWN INFORMACIÓN
  ===================================== */

  if (
    dropdown
    &&
    dropdownButton
  ) {

    dropdownButton.addEventListener(
      "click",
      event => {

        event.stopPropagation();


        const isOpen =
          dropdown.classList.toggle(
            "open"
          );


        dropdownButton.setAttribute(
          "aria-expanded",
          String(isOpen)
        );

      }
    );


    document.addEventListener(
      "click",
      event => {

        if (
          !dropdown.contains(
            event.target
          )
        ) {

          dropdown.classList.remove(
            "open"
          );


          dropdownButton.setAttribute(
            "aria-expanded",
            "false"
          );

        }

      }
    );

  }


  /* =====================================
     CERRAR MENÚ AL ENTRAR A UNA PÁGINA
  ===================================== */

  if (nav) {

    nav
      .querySelectorAll("a")
      .forEach(
        link => {

          link.addEventListener(
            "click",
            () => {

              nav.classList.remove(
                "active"
              );


              if (menuButton) {

                menuButton.classList.remove(
                  "active"
                );


                menuButton.setAttribute(
                  "aria-expanded",
                  "false"
                );

              }


              if (dropdown) {

                dropdown.classList.remove(
                  "open"
                );

              }

            }
          );

        }
      );

  }

}