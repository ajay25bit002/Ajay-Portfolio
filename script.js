const data = window.portfolioData;

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
})[character]);

document.querySelector("#skills-grid").innerHTML = data.skills.map((skill) => `
  <article class="skill-card reveal">
    <span class="skill-number">${escapeHtml(skill.number)}</span>
    <h3>${escapeHtml(skill.title)}</h3>
    <ul>${skill.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
  </article>
`).join("");

document.querySelector("#interests-list").innerHTML = data.interests
  .map((interest) => `<span class="interest-tag">${escapeHtml(interest)}</span>`).join("");

const projectList = document.querySelector("#projects-list");
projectList.innerHTML = data.projects.map((project, index) => `
  <article class="project-card reveal">
    <div class="project-preview preview-${escapeHtml(project.type)}" aria-hidden="true">
      <div class="preview-top"><span class="preview-brand">${escapeHtml(project.marker)} / AJ</span><span class="preview-dots">● ● ●</span></div>
      <div class="preview-content">
        <span class="preview-label">${escapeHtml(project.category)}</span>
        <span class="preview-glyph">${project.type === "market" ? "↗" : project.type === "craft" ? "✳" : "{ }"}</span>
        <span class="preview-caption">${escapeHtml(project.title)}</span>
      </div>
      <span class="preview-foot">CONCEPT OVERVIEW <span>↗</span></span>
    </div>
    <div class="project-body">
      <div class="project-meta"><span>${escapeHtml(project.category)}</span><span>0${index + 1}</span></div>
      <h3>${escapeHtml(project.title)}</h3>
      <p>${escapeHtml(project.description)}</p>
      <div class="tag-list">${project.technologies.map((technology) => `<span>${escapeHtml(technology)}</span>`).join("")}</div>
      <button class="text-button project-detail-button" type="button" data-project-index="${index}" aria-haspopup="dialog">
        Explore concept <span aria-hidden="true">↗</span>
      </button>
    </div>
  </article>
`).join("");

document.querySelector("#certificates-grid").innerHTML = data.certificates.map((certificate, index) => `
  <article class="certificate-card reveal">
    <div class="certificate-topline"><span>SIMULATION / 0${index + 1}</span><span class="certificate-mark">${escapeHtml(certificate.mark)}</span></div>
    <div class="certificate-seal" aria-hidden="true"><span>${escapeHtml(certificate.mark)}</span></div>
    <h3>${escapeHtml(certificate.title)}</h3>
    <div class="certificate-meta"><span>${escapeHtml(certificate.issuer)}</span><span>${escapeHtml(certificate.year)}</span></div>
    <p class="certificate-placeholder">Certificate image not supplied</p>
  </article>
`).join("");

document.querySelector("#education-list").innerHTML = data.education.map((item, index) => `
  <article class="education-item reveal">
    <span class="education-marker">${String(index + 1).padStart(2, "0")}</span>
    <div class="education-info">
      <div class="education-title-row"><h3>${escapeHtml(item.title)}</h3>${item.period ? `<span class="education-period">${escapeHtml(item.period)}</span>` : ""}</div>
      <p>${escapeHtml(item.institution)}${item.location ? ` <span>· ${escapeHtml(item.location)}</span>` : ""}</p>
    </div>
    ${item.detail ? `<span class="education-score">${escapeHtml(item.detail)}</span>` : ""}
  </article>
`).join("");

const dialog = document.querySelector("#project-dialog");
const closeDialogButton = dialog.querySelector(".dialog-close");
projectList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-project-index]");
  if (!button) return;
  const project = data.projects[Number(button.dataset.projectIndex)];
  if (!project) return;

  dialog.querySelector("#dialog-index").textContent = project.category;
  dialog.querySelector("#dialog-title").textContent = project.title;
  dialog.querySelector("#dialog-description").textContent = project.description;
  dialog.querySelector("#dialog-features").innerHTML = project.features
    .map((feature) => `<li>${escapeHtml(feature)}</li>`).join("");
  dialog.querySelector("#dialog-tech").innerHTML = project.technologies
    .map((technology) => `<span>${escapeHtml(technology)}</span>`).join("");
  dialog.showModal();
});
closeDialogButton.addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector("#primary-menu");
const closeMenu = () => {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  navMenu.classList.remove("menu-open");
};
menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation menu" : "Close navigation menu");
  navMenu.classList.toggle("menu-open", !isExpanded);
});
navMenu.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".nav-link")];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      const active = link.getAttribute("href") === `#${entry.target.id}`;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  });
}, { rootMargin: "-35% 0px -55% 0px" });
sections.forEach((section) => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal, .skill-card, .project-card, .certificate-card, .education-item")
  .forEach((element) => revealObserver.observe(element));

document.querySelector("#contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const formData = new FormData(form);
  const name = String(formData.get("name")).trim();
  const email = String(formData.get("email")).trim();
  const message = String(formData.get("message")).trim();
  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
  document.querySelector("#form-note").textContent = "Opening your email app with this message…";
  window.location.href = `mailto:ajay2007samy@gmail.com?subject=${subject}&body=${body}`;
});

document.querySelector("#current-year").textContent = new Date().getFullYear();
