export const customCss = `
  /* Topbar container styling */
  .swagger-ui .topbar {
    background-color: #1e293b !important;
    border-bottom: 1px solid #334155 !important;
    padding: 10px 0 !important;
    position: relative !important;
  }
  .swagger-ui .topbar .wrapper {
    max-width: 100% !important;
    padding: 0 24px !important;
    box-sizing: border-box !important;
  }
  .swagger-ui .topbar .topbar-wrapper {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    width: 100% !important;
    position: relative !important;
  }
  .swagger-ui .topbar .topbar-wrapper .link {
    display: flex !important;
    align-items: center !important;
  }

  /* Hide extension lightbulb visually while keeping it in DOM so click function stays alive */
  .swagger-ui .topbar-wrapper > *:not(.link):not(#theme-toggle-btn) {
    opacity: 0 !important;
    width: 0 !important;
    height: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
    position: absolute !important;
    pointer-events: none !important;
    overflow: hidden !important;
  }
  .swagger-ui .topbar > *:not(.wrapper) {
    display: none !important;
  }

  /* Single Theme Toggle Button at Far Right */
  #theme-toggle-btn {
    margin-left: auto !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 40px !important;
    height: 40px !important;
    border-radius: 50% !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    background: rgba(255, 255, 255, 0.1) !important;
    cursor: pointer !important;
    transition: all 0.2s ease-in-out !important;
    outline: none !important;
    padding: 0 !important;
    position: relative !important;
    z-index: 9999 !important;
  }
  #theme-toggle-btn:hover {
    background: rgba(255, 255, 255, 0.2) !important;
    transform: scale(1.08) !important;
    border-color: rgba(255, 255, 255, 0.4) !important;
  }
  #theme-toggle-btn svg {
    width: 22px !important;
    height: 22px !important;
    pointer-events: none !important;
  }

  /* Dark Theme Styles */
  body.dark-theme {
    background-color: #0f172a !important;
    color: #e2e8f0 !important;
  }
  body.dark-theme .swagger-ui {
    background-color: #0f172a;
    color: #e2e8f0;
  }
  body.dark-theme .swagger-ui .info .title {
    color: #f8fafc;
  }
  body.dark-theme .swagger-ui .info p,
  body.dark-theme .swagger-ui .info li,
  body.dark-theme .swagger-ui .info table {
    color: #94a3b8;
  }
  body.dark-theme .swagger-ui .info a {
    color: #38bdf8;
  }
  body.dark-theme .swagger-ui .scheme-container {
    background: #1e293b;
    box-shadow: none;
    border-bottom: 1px solid #334155;
  }
  body.dark-theme .swagger-ui .schemes > label {
    color: #e2e8f0;
  }
  body.dark-theme .swagger-ui select {
    background-color: #0f172a;
    color: #f8fafc;
    border-color: #475569;
  }
  body.dark-theme .swagger-ui .opblock-tag {
    color: #f8fafc;
    border-bottom-color: #334155;
  }
  body.dark-theme .swagger-ui .opblock-tag small {
    color: #94a3b8;
  }
  body.dark-theme .swagger-ui .opblock {
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
    background: #1e293b;
  }
  body.dark-theme .swagger-ui .opblock .opblock-summary {
    border-color: #334155;
  }
  body.dark-theme .swagger-ui .opblock .opblock-summary-operation-id,
  body.dark-theme .swagger-ui .opblock .opblock-summary-path,
  body.dark-theme .swagger-ui .opblock .opblock-summary-path__deprecated {
    color: #f1f5f9;
  }
  body.dark-theme .swagger-ui .opblock .opblock-summary-description {
    color: #94a3b8;
  }
  body.dark-theme .swagger-ui .opblock.opblock-get {
    background: rgba(16, 185, 129, 0.08);
    border-color: #10b981;
  }
  body.dark-theme .swagger-ui .opblock.opblock-post {
    background: rgba(59, 130, 246, 0.08);
    border-color: #3b82f6;
  }
  body.dark-theme .swagger-ui .opblock.opblock-put {
    background: rgba(245, 158, 11, 0.08);
    border-color: #f59e0b;
  }
  body.dark-theme .swagger-ui .opblock.opblock-delete {
    background: rgba(239, 68, 68, 0.08);
    border-color: #ef4444;
  }
  body.dark-theme .swagger-ui .opblock-body {
    background: #1e293b;
    color: #e2e8f0;
  }
  body.dark-theme .swagger-ui .opblock-description-wrapper p,
  body.dark-theme .swagger-ui .opblock-external-docs-wrapper p,
  body.dark-theme .swagger-ui .opblock-title_normal p {
    color: #cbd5e1;
  }
  body.dark-theme .swagger-ui .opblock-section-header {
    background: #0f172a;
    box-shadow: none;
  }
  body.dark-theme .swagger-ui .opblock-section-header h4 {
    color: #f8fafc;
  }
  body.dark-theme .swagger-ui table thead tr td,
  body.dark-theme .swagger-ui table thead tr th {
    color: #94a3b8;
    border-bottom-color: #334155;
  }
  body.dark-theme .swagger-ui .parameter__name {
    color: #f8fafc;
  }
  body.dark-theme .swagger-ui .parameter__type {
    color: #38bdf8;
  }
  body.dark-theme .swagger-ui .parameter__deprecated {
    color: #f87171;
  }
  body.dark-theme .swagger-ui .parameter__in {
    color: #94a3b8;
  }
  body.dark-theme .swagger-ui .tab li {
    color: #94a3b8;
  }
  body.dark-theme .swagger-ui .tab li.active {
    color: #38bdf8;
  }
  body.dark-theme .swagger-ui .responses-inner h4,
  body.dark-theme .swagger-ui .responses-inner h5 {
    color: #f1f5f9;
  }
  body.dark-theme .swagger-ui .response-col_status {
    color: #f1f5f9;
  }
  body.dark-theme .swagger-ui .response-col_description {
    color: #cbd5e1;
  }
  body.dark-theme .swagger-ui .response-col_description__inner div.markdown p {
    color: #cbd5e1;
  }
  body.dark-theme .swagger-ui .body-param__text,
  body.dark-theme .swagger-ui textarea,
  body.dark-theme .swagger-ui input[type=text] {
    background: #0f172a;
    color: #f8fafc;
    border-color: #475569;
  }
  body.dark-theme .swagger-ui .btn {
    background: #334155;
    color: #f8fafc;
    border-color: #475569;
  }
  body.dark-theme .swagger-ui .btn:hover {
    background: #475569;
  }
  body.dark-theme .swagger-ui .btn.execute {
    background-color: #2563eb;
    border-color: #2563eb;
    color: #fff;
  }
  body.dark-theme .swagger-ui .btn.execute:hover {
    background-color: #1d4ed8;
  }
  body.dark-theme .swagger-ui .btn.btn-clear {
    background: #475569;
  }
  body.dark-theme .swagger-ui section.models {
    border-color: #334155;
    background: #1e293b;
  }
  body.dark-theme .swagger-ui section.models h4 {
    color: #f8fafc;
    border-color: #334155;
  }
  body.dark-theme .swagger-ui section.models .model-container {
    background: #0f172a;
  }
  body.dark-theme .swagger-ui .model-box {
    background: #0f172a;
  }
  body.dark-theme .swagger-ui .model {
    color: #cbd5e1;
  }
  body.dark-theme .swagger-ui .model-title {
    color: #f8fafc;
  }
  body.dark-theme .swagger-ui .prop-type {
    color: #38bdf8;
  }
  body.dark-theme .swagger-ui .prop-format {
    color: #94a3b8;
  }
  body.dark-theme .swagger-ui .highlight-code pre,
  body.dark-theme .swagger-ui .microlight {
    background: #0f172a !important;
    color: #f8fafc !important;
    border-radius: 6px;
  }
  body.dark-theme .swagger-ui .response-control-media-type__title {
    color: #94a3b8;
  }
  body.dark-theme .swagger-ui .loading-container .loading::after {
    color: #f8fafc;
  }
`;

export const customJsStr = `
(function() {
  var SUN_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
  var MOON_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';

  var currentTheme = localStorage.getItem('recipely_swagger_theme') || 'dark';

  function applyTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('recipely_swagger_theme', theme);
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
    updateButton();
  }

  function updateButton() {
    var btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;
    var isDark = currentTheme === 'dark';
    btn.innerHTML = isDark ? SUN_ICON : MOON_ICON;
    btn.setAttribute('title', isDark ? 'Beralih ke Mode Terang (Light Mode)' : 'Beralih ke Mode Gelap (Dark Mode)');
    btn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
  }

  function findOriginalToggle() {
    var topbar = document.querySelector('.swagger-ui .topbar');
    if (!topbar) return null;
    var candidates = topbar.querySelectorAll('button, a, div, img, svg');
    for (var i = 0; i < candidates.length; i++) {
      var el = candidates[i];
      if (el.id === 'theme-toggle-btn' || el.closest('#theme-toggle-btn') || el.closest('.link')) {
        continue;
      }
      var str = (el.className || '') + ' ' + (el.id || '') + ' ' + (el.getAttribute('title') || '') + ' ' + (el.getAttribute('src') || '') + ' ' + el.innerHTML;
      if (/bulb|lamp|dark|night|theme|mode/i.test(str)) {
        return el;
      }
    }
    return null;
  }

  function mountButton() {
    var topbarWrapper = document.querySelector('.swagger-ui .topbar-wrapper');
    if (!topbarWrapper || document.getElementById('theme-toggle-btn')) return;

    var btn = document.createElement('button');
    btn.id = 'theme-toggle-btn';
    btn.className = 'theme-toggle-btn';
    btn.type = 'button';

    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();

      var orig = findOriginalToggle();
      if (orig) {
        orig.click();
      }

      applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });

    topbarWrapper.appendChild(btn);
    updateButton();
  }

  function init() {
    applyTheme(currentTheme);
    mountButton();

    var count = 0;
    var interval = setInterval(function() {
      mountButton();
      count++;
      if (document.getElementById('theme-toggle-btn') || count > 50) {
        clearInterval(interval);
      }
    }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
`;

export const swaggerUiOptions = {
  customCss,
  customJsStr,
  customSiteTitle: 'Recipely API - MasakApaHariIni Scraper Docs'
};
