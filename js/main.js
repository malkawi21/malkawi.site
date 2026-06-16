(() => {
  'use strict';

  const aosAvailable = typeof AOS !== 'undefined';
  const lightboxAvailable = typeof GLightbox !== 'undefined';

  if (aosAvailable) {
    AOS.init({ duration: 800, once: true });
  }

  const lightbox = lightboxAvailable ? GLightbox({ selector: '.glightbox' }) : null;

  const supportedLanguages = ['en', 'ar'];
  const defaultLanguage = 'en';

  const projects = [
    {
      id: 'ecommerce',
      images: ['images/ecommerce1.jpg', 'images/ecommerce2.jpg'],
      type: 'web'
    },
    {
      id: 'hotel',
      images: ['images/hotel1.jpg', 'images/hotel2.png'],
      type: 'web'
    },
    {
      id: 'portal',
      images: ['images/portal1.webp'],
      type: 'web'
    },
    {
      id: 'realtime',
      images: ['images/Alarm-Management.jpg', 'images/api.png'],
      type: 'api'
    },
    {
      id: 'scada',
      images: ['images/SCADA-system.jpg', 'images/scada.png'],
      type: 'scada'
    },
    {
      id: 'tracker',
      images: ['images/Tracker01.PNG', 'images/Tracker02.PNG', 'images/Tracker03.PNG', 'images/Tracker04.PNG', 'images/Solar-tracking-system.webp'],
      type: 'energy'
    },
    {
      id: 'portforwarder',
      images: ['images/Portforwarder01.PNG', 'images/Portforwarder02.PNG'],
      type: 'tools'
    },
    {
      id: 'modbus',
      images: ['images/modbusMaster01.PNG', 'images/modbusMaster02.PNG', 'images/modbusMaster03.PNG', 'images/Slave01.PNG', 'images/Slave02.PNG'],
      type: 'tools'
    },
    {
      id: 'configurator',
      images: ['images/Config01.PNG', 'images/Config02.PNG', 'images/Config03.PNG', 'images/Config04.PNG'],
      type: 'tools'
    },
    {
      id: 'cowrmat',
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

  let currentTranslations = null;
  let currentLanguage = localStorage.getItem('language') || defaultLanguage;

  const gallery = document.getElementById('project-gallery');
  const languageToggle = document.getElementById('languageToggle');
  const darkModeToggle = document.getElementById('darkModeToggle');

  function getNestedValue(object, path) {
    return path.split('.').reduce((value, key) => value?.[key], object);
  }

  function escapeAttribute(value) {
    return String(value ?? '').replace(/"/g, '&quot;');
  }

  async function loadTranslations(language) {
    const safeLanguage = supportedLanguages.includes(language) ? language : defaultLanguage;
    const response = await fetch(`lang/${safeLanguage}.json`, { cache: 'no-cache' });

    if (!response.ok) {
      throw new Error(`Failed to load language file: ${safeLanguage}`);
    }

    currentLanguage = safeLanguage;
    currentTranslations = await response.json();

    localStorage.setItem('language', safeLanguage);

    document.documentElement.lang = safeLanguage;
    document.documentElement.dir = safeLanguage === 'ar' ? 'rtl' : 'ltr';

    translateStaticContent();
    renderProjects(getActiveFilter());
  }

  function translateStaticContent() {
    if (!currentTranslations) return;

    document.querySelectorAll('[data-i18n]').forEach(element => {
      const value = getNestedValue(currentTranslations, element.dataset.i18n);
      if (value == null) return;

      if (element.tagName === 'TITLE') {
        document.title = value;
      } else {
        element.textContent = value;
      }
    });

    document.querySelectorAll('[data-i18n-html]').forEach(element => {
      const value = getNestedValue(currentTranslations, element.dataset.i18nHtml);
      if (value != null) {
        element.innerHTML = value;
      }
    });

    if (languageToggle) {
      languageToggle.textContent = currentLanguage === 'ar'
        ? currentTranslations.language.switchToEnglish
        : currentTranslations.language.switchToArabic;
    }
  }

  function getActiveFilter() {
    return document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
  }

  function renderProjects(filter = 'all') {
    if (!gallery || !currentTranslations) return;

    const allowedTypes = filterAliases[filter] || [filter];
    const filteredProjects = filter === 'all'
      ? projects
      : projects.filter(project => allowedTypes.includes(project.type));

    if (!filteredProjects.length) {
      gallery.innerHTML = `
        <div class="col-12 text-center py-5">
          <p class="lead mb-0">${currentTranslations.projects.empty}</p>
        </div>
      `;
      return;
    }

    gallery.innerHTML = filteredProjects.map(project => {
      const item = currentTranslations.projects.items[project.id];
      const title = item?.title || project.id;
      const desc = item?.desc || '';
      const typeLabel = currentTranslations.projects.types[project.type] || project.type;
      const galleryName = escapeAttribute(project.id);

      const thumbnails = project.images.slice(1, 4).map(image => `
        <a href="${image}" class="glightbox" data-gallery="${galleryName}">
          <img src="${image}" class="thumb" alt="${escapeAttribute(title)} preview" loading="lazy" onerror="this.src='https://via.placeholder.com/50x50?text=No+Image'">
        </a>
      `).join('');

      return `
        <div class="col-md-6 col-lg-4">
          <article class="card shadow-sm h-100 project-card" data-aos="fade-up">
            <div class="ratio ratio-16x9">
              <a href="${project.images[0]}" class="glightbox" data-gallery="${galleryName}">
                <img src="${project.images[0]}" class="card-img-top project-img" alt="${escapeAttribute(title)}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x200?text=Project+Image'">
              </a>
            </div>
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${title}</h5>
              <p class="card-text small">${desc}</p>
              <div class="mt-auto">
                <span class="badge bg-secondary mb-2">${typeLabel}</span>
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

  function initializeFilters() {
    document.querySelectorAll('.filter-btn').forEach(button => {
      button.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(item => item.classList.remove('active'));
        button.classList.add('active');
        renderProjects(button.dataset.filter || 'all');
      });
    });
  }

  function initializeLanguageToggle() {
    languageToggle?.addEventListener('click', async () => {
      const nextLanguage = currentLanguage === 'ar' ? 'en' : 'ar';
      await loadTranslations(nextLanguage);
    });
  }

  function initializeDarkMode() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      darkModeToggle?.querySelector('i')?.classList.replace('bi-moon', 'bi-sun');
    }

    darkModeToggle?.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');

      const isDark = document.body.classList.contains('dark-mode');
      const icon = darkModeToggle.querySelector('i');

      if (icon) {
        icon.classList.toggle('bi-moon', !isDark);
        icon.classList.toggle('bi-sun', isDark);
      }

      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  function initializeMobileNavbarAutoClose() {
    document.querySelectorAll('.navbar-collapse .nav-link').forEach(link => {
      link.addEventListener('click', () => {
        const collapse = document.querySelector('.navbar-collapse.show');
        if (!collapse || typeof bootstrap === 'undefined') return;

        bootstrap.Collapse.getOrCreateInstance(collapse).hide();
      });
    });
  }

  async function initialize() {
    initializeFilters();
    initializeLanguageToggle();
    initializeDarkMode();
    initializeMobileNavbarAutoClose();

    try {
      await loadTranslations(currentLanguage);
    } catch (error) {
      console.error(error);
      if (currentLanguage !== defaultLanguage) {
        await loadTranslations(defaultLanguage);
      }
    }
  }

  initialize();
})();
