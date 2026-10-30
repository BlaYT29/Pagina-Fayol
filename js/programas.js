function initializeProgramDocuments() {
  const buttons = document.querySelectorAll(".program-document-view");
  if (!buttons.length) return;

  const modal = document.createElement("div");
  modal.className = "program-pdf-modal";
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="program-pdf-backdrop" data-program-pdf-close></div>
    <div class="program-pdf-window" role="dialog" aria-modal="true" aria-labelledby="program-pdf-title">
      <header class="program-pdf-header">
        <div>
          <span>Colegio Henri Fayol</span>
          <h3 id="program-pdf-title">Documento</h3>
        </div>
        <div class="program-pdf-actions">
          <a href="#" target="_blank" rel="noopener" id="program-pdf-new-tab">Abrir en otra pestaña</a>
          <button type="button" class="program-pdf-close" data-program-pdf-close aria-label="Cerrar documento">×</button>
        </div>
      </header>
      <div class="program-pdf-body">
        <iframe id="program-pdf-viewer" title="Documento del Colegio Henri Fayol"></iframe>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const viewer = modal.querySelector("#program-pdf-viewer");
  const title = modal.querySelector("#program-pdf-title");
  const newTab = modal.querySelector("#program-pdf-new-tab");

  const openDocument = (path, documentTitle) => {
    viewer.src = path;
    title.textContent = documentTitle || "Documento";
    newTab.href = path;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeDocument = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    viewer.src = "";
    document.body.style.overflow = "";
  };

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      openDocument(button.dataset.document, button.dataset.title);
    });
  });

  modal.querySelectorAll("[data-program-pdf-close]").forEach(el => {
    el.addEventListener("click", closeDocument);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && modal.classList.contains("open")) {
      closeDocument();
    }
  });
}

document.addEventListener("DOMContentLoaded", initializeProgramDocuments);
