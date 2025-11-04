// --- AOS Animation ---
AOS.init({ duration: 800, once: true });

// --- GLightbox ---
const lightbox = GLightbox({ selector: '.glightbox' });

// --- Projects Data ---
const projects = [
  {
    title: "Real-Time Multi-Site Data Sync & Alarm Management",
    desc: "High-performance ASP.NET Core API for ingesting industrial data streams.",
    images: ["Alarm-Management.jpg", "api.png"],
    type: "api"
  },
  {
    title: "SCADA Systems",
    desc: "SCADA systems for monitoring and controlling industrial processes.",
    images: ["SCADA-system.jpg","scada.png"],
    type: "scada"
  },
  {
    title: "PMM Port Forwarder",
    desc: "Serial-to-UDP forwarding utility for PMM systems.",
    images: ["Portforwarder01.png","Portforwarder02.png"],
    type: "tools"
  },
  {
    title: "Modbus Tester (Pool & Slave)",
    desc: "Diagnostic and simulation utility for Modbus networks, supporting both master and slave modes with live data monitoring and command testing.",
    images: ["modbusMaster01.png", "modbusMaster02.png", "modbusMaster03.png", "modbusMaster02.png", "Slave01.png", "Slave02.png"],
    type: "tools"
  },
  {
    title: "PMM Product Configurator",
    desc: "Unified configuration tool for PMM hardware — allows control, installation, and parameter management of all company devices from a single interface.",
    images: ["Config01.png", "Config02.png" , "Config03.png", "Config04.png"],
    type: "software"
  },
  {
    title: "PMM Tracker Controller",
    desc: "A control and monitoring application for solar tracking systems — manages panel positioning, real-time status updates, and performance optimization for solar farms.",
    images: ["Tracker01.png", "Tracker02.png", "Tracker03.png", "Tracker04.png", "Solar-tracking-system.webp"],
    type: "energy"
  }
];

// --- Generate Project Cards ---
const gallery = document.getElementById("project-gallery");
function renderProjects(filter) {
  gallery.innerHTML = "";
  projects
    .filter(p => filter === "all" || p.type === filter)
    .forEach(p => {
      const card = document.createElement("div");
      card.className = "col-md-6 col-lg-4";
      const imgs = p.images
        .map(
          (img, i) =>
            `<a href="images/${img}" class="glightbox" data-gallery="${p.title}">
              <img src="images/${img}" class="thumb" alt="">
            </a>`
        )
        .join("");

      card.innerHTML = `
        <div class="card shadow-sm h-100 project-card" data-aos="fade-up">
          <div class="ratio ratio-16x9">
            <a href="images/${p.images[0]}" class="glightbox" data-gallery="${p.title}">
              <img src="images/${p.images[0]}" class="card-img-top project-img" alt="${p.title}">
            </a>
          </div>
          <div class="card-body">
            <h5>${p.title}</h5>
            <p>${p.desc}</p>
            <div class="gallery-thumbs mt-2">${imgs}</div>
          </div>
        </div>
      `;
      gallery.appendChild(card);
    });
  lightbox.reload();
}

renderProjects("all");

// --- Project Filtering ---
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", e => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    e.target.classList.add("active");
    renderProjects(e.target.dataset.filter);
  });
});

// --- Dark Mode Toggle ---
const toggle = document.getElementById("darkModeToggle");
toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const icon = toggle.querySelector("i");
  if (document.body.classList.contains("dark-mode")) {
    icon.classList.replace("bi-moon", "bi-sun");
  } else {
    icon.classList.replace("bi-sun", "bi-moon");
  }
});
