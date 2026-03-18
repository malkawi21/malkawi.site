// --- AOS Animation ---
    AOS.init({ duration: 800, once: true });

    // --- GLightbox ---
    const lightbox = GLightbox({ selector: '.glightbox' });

    // --- Projects Data ---
    const projects = [
      // Web Applications
      {
        title: "E-Commerce Platform",
        desc: "Full-featured online store with product management, shopping cart, payment integration (Stripe/PayPal), and order tracking system built with ASP.NET Core.",
        images: ["images/ecommerce1.jpg", "images/ecommerce2.jpg"],
        type: "web"
      },
      {
        title: "Hotel Booking System",
        desc: "Complete reservation system with room availability calendar, online payments, admin dashboard, automated email confirmations, and customer management.",
        images: ["images/hotel1.jpg","images/hotel2.PNG"],
        type: "web"
      },
      {
        title: "Employee Portal",
        desc: "Internal company portal with leave management, attendance tracking, performance reviews, and company announcements.",
        images: ["images/portal1.webp"],
        type: "web"
      },
      
      // APIs
      {
        title: "Real-Time Multi-Site Data Sync & Alarm Management",
        desc: "High-performance ASP.NET Core API for ingesting industrial data streams from multiple locations with real-time synchronization.",
        images: ["images/Alarm-Management.jpg", "images/api.png"],
        type: "api"
      },
      
      // Industrial / SCADA
      {
        title: "SCADA Systems Integration",
        desc: "Web-based SCADA systems for monitoring and controlling industrial processes with real-time data visualization.",
        images: ["images/SCADA-system.jpg", "images/scada.png"],
        type: "scada"
      },
      {
        title: "Solar Tracker Controller",
        desc: "A control and monitoring application for solar tracking systems — manages panel positioning, real-time status updates, and performance optimization for solar farms.",
        images: ["images/Tracker01.PNG", "images/Tracker02.PNG", "images/Tracker03.PNG", "images/Tracker04.PNG", "images/Solar-tracking-system.webp"],
        type: "energy"
      },
      
      // Tools
      {
        title: "PMM Port Forwarder",
        desc: "Serial-to-UDP forwarding utility for PMM systems — enables remote access to serial devices over network.",
        images: ["images/Portforwarder01.PNG", "images/Portforwarder02.PNG"],
        type: "tools"
      },
      {
        title: "Modbus Tester (Master & Slave)",
        desc: "Diagnostic and simulation utility for Modbus networks, supporting both master and slave modes with live data monitoring and command testing.",
        images: ["images/modbusMaster01.PNG", "images/modbusMaster02.PNG", "images/modbusMaster03.PNG", "images/Slave01.PNG", "images/Slave02.PNG"],
        type: "tools"
      },
      {
        title: "PMM Product Configurator",
        desc: "Unified configuration tool for PMM hardware — allows control, installation, and parameter management of all company devices from a single interface.",
        images: ["images/Config01.PNG", "images/Config02.PNG", "images/Config03.PNG", "images/Config04.PNG"],
        type: "tools"
      },
      
      // Agriculture
      {
        title: "COWRMAT - Crop Optimization Tool",
        desc: "A professional decision-support system designed to optimize crop planning, improve irrigation efficiency, and support sustainable treated wastewater allocation for agricultural management.",
        images: ["images/agri1.PNG", "images/agri2.PNG", "images/agri3.PNG", "images/agri4.PNG"],
        type: "agriculture"
      }
    ];

    // --- Generate Project Cards ---
    const gallery = document.getElementById("project-gallery");
    
    function renderProjects(filter) {
      gallery.innerHTML = "";
      const filtered = filter === "all" ? projects : projects.filter(p => p.type === filter);
      
      if (filtered.length === 0) {
        gallery.innerHTML = '<div class="col-12 text-center py-5"><p class="lead">No projects found in this category</p></div>';
        return;
      }
      
      filtered.forEach(p => {
        const card = document.createElement("div");
        card.className = "col-md-6 col-lg-4";
        
        const thumbnails = p.images.slice(1, 4).map(img => 
          `<a href="${img}" class="glightbox" data-gallery="${p.title}">
            <img src="${img}" class="thumb" alt="" onerror="this.src='https://via.placeholder.com/50x50?text=No+Image'">
          </a>`
        ).join("");

        card.innerHTML = `
          <div class="card shadow-sm h-100 project-card" data-aos="fade-up">
            <div class="ratio ratio-16x9">
              <a href="${p.images[0]}" class="glightbox" data-gallery="${p.title}">
                <img src="${p.images[0]}" class="card-img-top project-img" alt="${p.title}" onerror="this.src='https://via.placeholder.com/300x200?text=Project+Image'">
              </a>
            </div>
            <div class="card-body">
              <h5 class="card-title">${p.title}</h5>
              <p class="card-text small">${p.desc}</p>
              <span class="badge bg-secondary mb-2">${p.type}</span>
              ${p.images.length > 1 ? `
                <div class="gallery-thumbs mt-2">
                  ${thumbnails}
                </div>
              ` : ''}
            </div>
          </div>
        `;
        gallery.appendChild(card);
      });
      
      // Reload lightbox for new images
      lightbox.reload();
    }

    // Initial render
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

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  