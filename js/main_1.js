(() => {
  'use strict';

  const aosAvailable = typeof AOS !== 'undefined';
  const lightboxAvailable = typeof GLightbox !== 'undefined';

  if (aosAvailable) {
    AOS.init({ duration: 800, once: true });
  }

  const lightbox = lightboxAvailable ? GLightbox({ selector: '.glightbox' }) : null;

  const projects = [
    {
      title: 'E-Commerce Platform',
      desc: 'Full-featured online store with product management, shopping cart, payment integration (Stripe/PayPal), and order tracking system built with ASP.NET Core.',
      images: ['images/ecommerce1.jpg', 'images/ecommerce2.jpg'],
      type: 'web'
    },
    {
      title: 'Hotel Booking System',
      desc: 'Complete reservation system with room availability calendar, online payments, admin dashboard, automated email confirmations, and customer management.',
      images: ['images/hotel1.jpg', 'images/hotel2.png'],
      type: 'web'
    },
    {
      title: 'Employee Portal',
      desc: 'Internal company portal with leave management, attendance tracking, performance reviews, and company announcements.',
      images: ['images/portal1.webp'],
      type: 'web'
    },
    {
      title: 'Real-Time Multi-Site Data Sync & Alarm Management',
      desc: 'High-performance ASP.NET Core API for ingesting industrial data streams from multiple locations with real-time synchronization.',
      images: ['images/Alarm-Management.jpg', 'images/api.png'],
      type: 'api'
    },
    {
      title: 'SCADA Systems Integration',
      desc: 'Web-based SCADA systems for monitoring and controlling industrial processes with real-time data visualization.',
      images: ['images/SCADA-system.jpg', 'images/scada.png'],
      type: 'scada'
    },
    {
      title: 'Solar Tracker Controller',
      desc: 'A control and monitoring application for solar tracking systems — manages panel positioning, real-time status updates, and performance optimization for solar farms.',
      images: ['images/Tracker01.PNG', 'images/Tracker02.PNG', 'images/Tracker03.PNG', 'images/Tracker04.PNG', 'images/Solar-tracking-system.webp'],
      type: 'energy'
    },
    {
      title: 'PMM Port Forwarder',
      desc: 'Serial-to-UDP forwarding utility for PMM systems — enables remote access to serial devices over network.',
      images: ['images/Portforwarder01.PNG', 'images/Portforwarder02.PNG'],
      type: 'tools'
    },
    {
      title: 'Modbus Tester (Master & Slave)',
      desc: 'Diagnostic and simulation utility for Modbus networks, supporting both master and slave modes with live data monitoring and command testing.',
      images: ['images/modbusMaster01.PNG', 'images/modbusMaster02.PNG', 'images/modbusMaster03.PNG', 'images/Slave01.PNG', 'images/Slave02.PNG'],
      type: 'tools'
    },
    {
      title: 'PMM Product Configurator',
      desc: 'Unified configuration tool for PMM hardware — allows control, installation, and parameter management of all company devices from a single interface.',
      images: ['images/Config01.PNG', 'images/Config02.PNG', 'images/Config03.PNG', 'images/Config04.PNG'],
      type: 'tools'
    },
    {
      title: 'COWRMAT - Crop Optimization Tool',
      desc: 'A professional decision-support system designed to optimize crop planning, improve irrigation efficiency, and support sustainable treated wastewater allocation for agricultural management.',
      images: ['images/agri1.PNG', 'images/agri2.PNG', 'images/agri3.PNG', 'images/agri4.PNG'],
      type: 'agriculture'
    }
  ];

  const filterAliases = {
    all: ['web', 'api', 'scada', 'energy', 'tools', 'agriculture'],
    industrial: ['scada', 'energy', 'tools'],
    mobile: [],
    laravel: ['web'],
    web: ['web'],
    api: ['api'],
    agriculture: ['agriculture']
  };

  const gallery = document.getElementById('project-gallery');

  function escapeAttribute(value) {
    return String(value).replace(/"/g, '&quot;');
  }

  function renderProjects(filter = 'all') {
    if (!gallery) return;

    const allowedTypes = filterAliases[filter] || [filter];
    const filtered = filter === 'all'
      ? projects
      : projects.filter(project => allowedTypes.includes(project.type));

    if (!filtered.length) {
      gallery.innerHTML = '<div class="col-12 text-center py-5"><p class="lead mb-0">No projects found in this category</p></div>';
      return;
    }

    gallery.innerHTML = filtered.map(project => {
      const galleryName = escapeAttribute(project.title);
      const thumbnails = project.images.slice(1, 4).map(image => `
        <a href="${image}" class="glightbox" data-gallery="${galleryName}">
          <img src="${image}" class="thumb" alt="${galleryName} preview" loading="lazy" onerror="this.src='https://via.placeholder.com/50x50?text=No+Image'">
        </a>
      `).join('');

      return `
        <div class="col-md-6 col-lg-4">
          <article class="card shadow-sm h-100 project-card" data-aos="fade-up">
            <div class="ratio ratio-16x9">
              <a href="${project.images[0]}" class="glightbox" data-gallery="${galleryName}">
                <img src="${project.images[0]}" class="card-img-top project-img" alt="${galleryName}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x200?text=Project+Image'">
              </a>
            </div>
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${project.title}</h5>
              <p class="card-text small">${project.desc}</p>
              <div class="mt-auto">
                <span class="badge bg-secondary mb-2">${project.type}</span>
                ${project.images.length > 1 ? `<div class="gallery-thumbs mt-2">${thumbnails}</div>` : ''}
              </div>
            </div>
          </article>
        </div>
      `;
    }).join('');

    if (lightbox) lightbox.reload();
    if (aosAvailable) AOS.refreshHard();
  }

  renderProjects('all');

  document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      renderProjects(button.dataset.filter || 'all');
    });
  });

  const toggle = document.getElementById('darkModeToggle');
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    toggle?.querySelector('i')?.classList.replace('bi-moon', 'bi-sun');
  }

  toggle?.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    const icon = toggle.querySelector('i');

    if (icon) {
      icon.classList.toggle('bi-moon', !isDark);
      icon.classList.toggle('bi-sun', isDark);
    }

    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  document.querySelectorAll('.navbar-collapse .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const collapse = document.querySelector('.navbar-collapse.show');
      if (!collapse || typeof bootstrap === 'undefined') return;
      bootstrap.Collapse.getOrCreateInstance(collapse).hide();
    });
  });
})();
