/* ══════════════════════════════════════════════════════════════
   MAIN JAVASCRIPT CONTROLLER
   Navigation, Magnetic Buttons, Scroll Spy, Non-Card UI Handlers
   ══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initScrollProgressBar();
  initMobileDrawer();
  initMagneticButtons();
  initButtonRipples();
  initScrollSpy();
  initFlipCards();
  initNewsletterForm();
  initPricingToggle();
  initCaseStudyFilters();
  initSmoothNavigation();
  initWorkbenchInspector();
  initFeatureTelemetry();
  initExecutiveSpotlight();
  initAssuranceBentoTilt();
  initSection10Interactions();
  initRoiCalculator();
  initPlatformCockpitTabs();
  initUniversalAccordions();
  initServicesInteractiveComponents();
  initPipelineStepper();
  initArchMatrixTabs();
  initIndustryAccordion();
  initCoreEngineConsole();
  initFooterLinks();
});

/* 0. Footer Links Behavior Update */
function initFooterLinks() {


  // Set all social icons to navigate to 404.html
  document.querySelectorAll('.footer-social-links a').forEach(link => {
    link.href = '404.html';
  });

  // Set all Architecture & Trust links to navigate to 404.html
  document.querySelectorAll('.footer-col-title').forEach(title => {
    if (title.textContent.includes('Architecture & Trust')) {
      const list = title.nextElementSibling;
      if (list && list.classList.contains('footer-nav-list')) {
        list.querySelectorAll('a').forEach(link => {
          link.href = '404.html';
        });
      }
    }
  });
}

/* 1. Sticky Header Glass Transition */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* 2. Top Scroll Progress Indicator */
function initScrollProgressBar() {
  const progressBar = document.querySelector('.scroll-progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = `${progress}%`;
  }, { passive: true });
}

/* 3. Luxury Mobile Drawer Navigation Toggle */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('mobileDrawerOverlay');
  const closeBtn = document.getElementById('mobileDrawerClose');
  const navLinks = document.querySelectorAll('.mobile-nav-card, .mobile-drawer .btn, .mobile-drawer-header .brand-logo');

  // Highlight active page link dynamically based on current URL
  const setActiveNavLink = () => {
    const rawPath = window.location.pathname.split('/').pop() || 'index.html';
    const currentPath = rawPath.toLowerCase();
    const navCards = drawer.querySelectorAll('.mobile-nav-card');
    
    navCards.forEach((card) => {
      const href = (card.getAttribute('href') || '').toLowerCase();
      if (
        href === currentPath ||
        (currentPath === '' && href === 'index.html') ||
        (currentPath === '/' && href === 'index.html') ||
        (currentPath.includes('services') && href.includes('services')) ||
        (currentPath.includes('platform') && href.includes('platform')) ||
        (currentPath.includes('pricing') && href.includes('pricing')) ||
        (currentPath.includes('contact') && href.includes('contact'))
      ) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  };

  setActiveNavLink();

  let savedScrollY = 0;

  const openDrawer = () => {
    setActiveNavLink();
    savedScrollY = window.scrollY || window.pageYOffset || 0;

    drawer.classList.add('is-active');
    if (toggleBtn) {
      toggleBtn.classList.add('is-active');
      toggleBtn.setAttribute('aria-expanded', 'true');
    }
    if (overlay) overlay.classList.add('is-active');
    drawer.setAttribute('aria-hidden', 'false');

    // Completely lock background scroll across all mobile & desktop browsers
    document.documentElement.classList.add('drawer-open');
    document.body.classList.add('drawer-open');
    document.body.style.position = 'fixed';
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';

    // Staggered luxury reveal animation
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(
        '.mobile-nav-card',
        { opacity: 0, x: 25 },
        { opacity: 1, x: 0, stagger: 0.05, duration: 0.35, ease: 'power2.out', delay: 0.15 }
      );
      gsap.fromTo(
        '.mobile-drawer-footer',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', delay: 0.4 }
      );
    }
  };

  const closeDrawer = () => {
    drawer.classList.remove('is-active');
    if (toggleBtn) {
      toggleBtn.classList.remove('is-active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
    if (overlay) overlay.classList.remove('is-active');
    drawer.setAttribute('aria-hidden', 'true');

    // Unlock background scroll and restore exact scroll position
    document.documentElement.classList.remove('drawer-open');
    document.body.classList.remove('drawer-open');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    window.scrollTo(0, savedScrollY);
  };

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (drawer.classList.contains('is-active')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) {
    overlay.addEventListener('click', closeDrawer);
    // Prevent touch scrolling on backdrop overlay
    overlay.addEventListener('touchmove', (e) => {
      e.preventDefault();
    }, { passive: false });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-active')) {
      closeDrawer();
    }
  });
}

/* 4. Magnetic Buttons (Desktop Only) */
function initMagneticButtons() {
  // Buttons remain strictly locked on their horizontal line without moving up/down
  const magneticBtns = document.querySelectorAll('.btn-magnetic');
  magneticBtns.forEach((btn) => {
    btn.style.transform = 'none';
  });
}

/* 5. Button Ripple Effect */
function initButtonRipples() {
  const buttons = document.querySelectorAll('.btn');

  buttons.forEach((button) => {
    button.addEventListener('click', function (e) {
      const rect = button.getBoundingClientRect();
      const circle = document.createElement('span');
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add('ripple');

      const existingRipple = button.querySelector('.ripple');
      if (existingRipple) existingRipple.remove();

      button.appendChild(circle);
    });
  });
}

/* 6. Active Scroll Spy */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  const onScroll = () => {
    const scrollPos = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* 7. Interactive 3D Flip Cards */
function initFlipCards() {
  const flipCards = document.querySelectorAll('.flip-card');
  flipCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      card.classList.toggle('flipped');
    });
  });
}

/* 8. Newsletter Form Feedback */
function initNewsletterForm() {
  const forms = document.querySelectorAll('.footer-newsletter-form, #newsletter-form');
  if (!forms.length) return;

  // Clear form when returning via back button
  window.addEventListener('pageshow', () => {
    forms.forEach(form => {
      form.reset();
      
      // Force reset any old state (in case old JS ran and changed these before)
      const input = form.querySelector('.newsletter-input');
      const submitBtn = form.querySelector('.newsletter-submit-btn');
      if (input) {
        input.value = '';
        input.placeholder = 'cfo@enterprise.com';
      }
      if (submitBtn) {
        submitBtn.textContent = 'Subscribe';
        submitBtn.style.backgroundColor = '';
      }
    });
  });

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input');

      if (input && input.value.trim()) {
        input.value = '';
        window.location.href = '404.html';
      }
    });
  });
}

/* 9. Pricing Billing Cycle Toggle & Team Size Estimator */
function initPricingToggle() {
  const toggleCheckbox = document.getElementById('pricing-toggle-checkbox');
  const monthlyLabel = document.getElementById('billing-monthly');
  const annualLabel = document.getElementById('billing-annual');
  const priceAmounts = document.querySelectorAll('.price-amount[data-monthly]');
  const teamSlider = document.getElementById('calc-team-slider');
  const teamSizeDisplay = document.getElementById('calc-team-size-display');
  const estGrowth = document.getElementById('live-est-growth');
  const estEnterprise = document.getElementById('live-est-enterprise');

  if (!toggleCheckbox || !priceAmounts.length) return;

  const calculateEstimates = () => {
    const isAnnual = toggleCheckbox.checked;
    const seats = parseInt(teamSlider?.value || 25, 10);

    if (teamSizeDisplay) {
      teamSizeDisplay.textContent = seats;
    }

    // Rates
    const growthBase = isAnnual ? 39 : 49;
    const growthPerEmp = isAnnual ? 5 : 6;
    const enterpriseBase = isAnnual ? 119 : 149;
    const enterprisePerEmp = isAnnual ? 7 : 9;

    const growthTotal = growthBase + (seats * growthPerEmp);
    const enterpriseTotal = enterpriseBase + (seats * enterprisePerEmp);

    if (estGrowth) {
      estGrowth.textContent = `Est: $${growthTotal.toLocaleString()}/mo`;
    }
    if (estEnterprise) {
      estEnterprise.textContent = `Est: $${enterpriseTotal.toLocaleString()}/mo`;
    }
  };

  const updatePricing = (isAnnual) => {
    if (isAnnual) {
      monthlyLabel?.classList.remove('active');
      annualLabel?.classList.add('active');
    } else {
      monthlyLabel?.classList.add('active');
      annualLabel?.classList.remove('active');
    }

    priceAmounts.forEach((el) => {
      const targetVal = isAnnual ? el.getAttribute('data-annual') : el.getAttribute('data-monthly');
      if (targetVal) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(-4px)';
        setTimeout(() => {
          el.textContent = targetVal;
          el.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, 150);
      }
    });

    calculateEstimates();
  };

  toggleCheckbox.addEventListener('change', (e) => {
    updatePricing(e.target.checked);
  });

  monthlyLabel?.addEventListener('click', () => {
    if (toggleCheckbox.checked) {
      toggleCheckbox.checked = false;
      updatePricing(false);
    }
  });

  annualLabel?.addEventListener('click', () => {
    if (!toggleCheckbox.checked) {
      toggleCheckbox.checked = true;
      updatePricing(true);
    }
  });

  if (teamSlider) {
    teamSlider.addEventListener('input', calculateEstimates);
  }

  // Initial calculation
  calculateEstimates();
}

/* 10. Accurate Smooth Anchor Navigation */
function initSmoothNavigation() {
  if (window.location.hash === '#hero' || window.location.hash === '') {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#' || targetId === '#!') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        if (targetId === '#hero') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const header = document.querySelector('.site-header');
          const headerHeight = header ? header.offsetHeight : 70;
          const targetY = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
        }
        try {
          history.pushState(null, null, targetId);
        } catch (err) {}
      }
    });
  });
}

/* 11. Section 2: Architectural Workbench & Module Inspector Controller */
function initWorkbenchInspector() {
  const moduleButtons = document.querySelectorAll('.wb-module-item');
  if (!moduleButtons.length) return;

  const dataMap = {
    '01': {
      title: 'Automated Multi-State Pay Runs',
      tag: 'CORE DISBURSEMENT ENGINE',
      lead: 'Calculate gross-to-net withholdings across all 50 states with zero human intervention. Real-time direct deposit and instant ledger synchronisation.',
      m1Val: '100%', m1Lbl: 'ACCURACY', m1Desc: 'Statutory calculations',
      m2Val: '2-Min', m2Lbl: 'EXECUTION', m2Desc: 'Per 500 headcount',
      m3Val: '50', m3Lbl: 'STATES', m3Desc: 'Multi-jurisdictional',
      specBadge: 'v4.8 ACTIVE',
      specs: [
        'Automated gross-to-net payroll engine with customizable deduction matrices',
        'Direct integration with major banking protocols for Same-Day & Next-Day ACH',
        'Automatic wage garnishment disbursement and court order compliance'
      ]
    },
    '02': {
      title: 'Statutory Tax Filing & Liability Guarantee',
      tag: 'ZERO-PENALTY TAX ENGINE',
      lead: 'Complete federal, state, and municipal tax filing with a 100% CPA accuracy guarantee. Aurelia assumes all financial liability for calculation accuracy.',
      m1Val: '$0', m1Lbl: 'PENALTY', m1Desc: 'Full liability shield',
      m2Val: '4-Tier', m2Lbl: 'TAX LEVELS', m2Desc: 'Federal/State/Local/FUTA',
      m3Val: '100%', m3Lbl: 'ELECTRONIC', m3Desc: 'Automated 941/W-2 filings',
      specBadge: 'IRS APPROVED',
      specs: [
        'Quarterly 941, annual 940, W-2, and 1099-NEC automated e-filing directly to IRS',
        'Automated local tax calculations across over 10,000 taxing jurisdictions',
        'Full indemnification agreement guaranteeing zero late or calculation penalties'
      ]
    },
    '03': {
      title: 'Biometric & GPS Time-Tracking Hardware',
      tag: 'GEO-VERIFIED ATTENDANCE',
      lead: 'Synchronize physical biometric turnstiles and mobile GPS geofencing with overtime calculators and shift differentials seamlessly.',
      m1Val: '0.2s', m1Lbl: 'LATENCY', m1Desc: 'Terminal cloud sync',
      m2Val: '100%', m2Lbl: 'GEOFENCE', m2Desc: 'GPS spoof-proof radius',
      m3Val: '0', m3Lbl: 'DISPUTES', m3Desc: 'Audited clock punches',
      specBadge: 'HARDWARE SYNC',
      specs: [
        'Plug-and-play synchronization with Suprema, ZKTeco, and facial recognition clocks',
        'Geofenced mobile clock-in radius with offline biometric punch caching',
        'Automatic FLSA overtime, meal penalty, and hazard-pay computation'
      ]
    },
    '04': {
      title: 'Global Multi-Currency Disbursals',
      tag: 'CROSS-BORDER WORKFORCE',
      lead: 'Pay overseas contractors and international subsidiaries in 40+ local currencies at mid-market FX rates with local tax compliance.',
      m1Val: '40+', m1Lbl: 'CURRENCIES', m1Desc: 'Direct local routing',
      m2Val: '< 24hr', m2Lbl: 'SETTLEMENT', m2Desc: 'Cross-border liquidity',
      m3Val: '160+', m3Lbl: 'COUNTRIES', m3Desc: 'Global payment reach',
      specBadge: 'SWIFT / SEPA / ACH',
      specs: [
        'Local clearing networks (SEPA, Faster Payments, Pix) for near-instant disbursals',
        'Mid-market exchange rate lock-in with zero hidden markup fees',
        'International statutory contractor compliance and Form W-8BEN validation'
      ]
    },
    '05': {
      title: 'Executive Analytics & Board Telemetry',
      tag: 'STRATEGIC WORKFORCE INTELLIGENCE',
      lead: 'Real-time department labor cost forecasting, turnover correlation metrics, and one-click financial audit export packs.',
      m1Val: 'Real-Time', m1Lbl: 'TELEMETRY', m1Desc: 'Instant ledger sync',
      m2Val: '1-Click', m2Lbl: 'AUDIT PACK', m2Desc: 'SOC-2 compliant reports',
      m3Val: '10-Yr', m3Lbl: 'LEDGER RETENTION', m3Desc: 'Immutable audit trail',
      specBadge: 'REST API READY',
      specs: [
        'Predictive labor cost variance modeling by department and project code',
        'Live GL integration with NetSuite, SAP, Workday, QuickBooks, and Sage Intacct',
        'Role-based granular executive permissions with immutable cryptographic logs'
      ]
    },
    '06': {
      title: 'White-Glove 48-Hour Migration Suite',
      tag: 'ZERO-DOWNTIME ONBOARDING',
      lead: 'Our dedicated CPAs migrate historical payroll data, employee tax profiles, and YTD balances in 48 hours without dual-entry headaches.',
      m1Val: '48hr', m1Lbl: 'TURNAROUND', m1Desc: 'Average migration time',
      m2Val: '100%', m2Lbl: 'ACCURACY', m2Desc: 'Dual-run validation',
      m3Val: 'Dedicated', m3Lbl: 'CPA LEAD', m3Desc: 'Assigned specialist',
      specBadge: 'WHITE-GLOVE',
      specs: [
        'Automated parser for legacy exports (ADP, Paychex, Gusto, Workday, QuickBooks)',
        'Parallel pay-run auditing and pixel-perfect gross-to-net reconciliation',
        'Direct employee onboarding assistance and live concierge training sessions'
      ]
    }
  };

  const titleEl = document.getElementById('inspectorTitle');
  const catEl = document.getElementById('inspectorCategory');
  const leadEl = document.getElementById('inspectorLead');
  const m1ValEl = document.getElementById('inspectorM1Val');
  const m1LblEl = document.getElementById('inspectorM1Lbl');
  const m1DescEl = document.getElementById('inspectorM1Desc');
  const m2ValEl = document.getElementById('inspectorM2Val');
  const m2LblEl = document.getElementById('inspectorM2Lbl');
  const m2DescEl = document.getElementById('inspectorM2Desc');
  const m3ValEl = document.getElementById('inspectorM3Val');
  const m3LblEl = document.getElementById('inspectorM3Lbl');
  const m3DescEl = document.getElementById('inspectorM3Desc');
  const specListEl = document.getElementById('inspectorSpecList');
  const specBadgeEl = document.getElementById('inspectorSpecBadge');

  moduleButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      moduleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const modKey = btn.getAttribute('data-module');
      const data = dataMap[modKey];
      if (!data) return;

      // Animate update
      if (titleEl) titleEl.textContent = data.title;
      if (catEl) catEl.textContent = data.tag;
      if (leadEl) leadEl.textContent = data.lead;
      if (m1ValEl) m1ValEl.textContent = data.m1Val;
      if (m1LblEl) m1LblEl.textContent = data.m1Lbl;
      if (m1DescEl) m1DescEl.textContent = data.m1Desc;
      if (m2ValEl) m2ValEl.textContent = data.m2Val;
      if (m2LblEl) m2LblEl.textContent = data.m2Lbl;
      if (m2DescEl) m2DescEl.textContent = data.m2Desc;
      if (m3ValEl) m3ValEl.textContent = data.m3Val;
      if (m3LblEl) m3LblEl.textContent = data.m3Lbl;
      if (m3DescEl) m3DescEl.textContent = data.m3Desc;
      if (specBadgeEl) specBadgeEl.textContent = data.specBadge;

      if (specListEl) {
        specListEl.innerHTML = data.specs.map(item => `
          <li><i class="fa-solid fa-check text-accent"></i> ${item}</li>
        `).join('');
      }
    });
  });
}

/* 12. Section 3: Panoramic Feature Telemetry Matrix Controller */
function initFeatureTelemetry() {
  const tabButtons = document.querySelectorAll('.ft-tab-btn');
  if (!tabButtons.length) return;

  const dataMap = {
    'hris': {
      badge: 'ENTERPRISE MASTER DIRECTORY',
      title: 'Unified Workforce Command & Real-Time Master Ledger',
      desc: 'Centralize all employee master records, dynamic salary tiers, multi-state tax forms, and departmental hierarchy trees into one cohesive, single-sign-on operational headquarters.',
      p1Val: '<120ms', p1Lbl: 'INGESTION LATENCY', p1Sub: 'Zero replication lag',
      p2Val: 'SSO / SAML 2.0', p2Lbl: 'SECURITY PROTOCOL', p2Sub: 'Okta & Azure AD verified',
      p3Val: '100K+ Seats', p3Lbl: 'RECORD CAPACITY', p3Sub: 'Elastic cloud scale',
      highlights: [
        'Instant historical compensation audits across all past fiscal years',
        'Custom role-based access control (RBAC) down to granular field level',
        'Automated sync with Okta, Microsoft Entra ID, and Google Workspace'
      ],
      terminalMeta: 'LIVE_TELEMETRY // HRIS_COMMAND_V3.9',
      stat1Lbl: 'SYNCED ENTITIES', stat1: '1,420 Active',
      stat2Lbl: 'PAYROLL CYCLE', stat2: 'Bi-Weekly 15/30',
      stat3Lbl: 'API STATUS', stat3: 'Healthy (99.99%)',
      ledger: [
        { name: 'Elena Rostova', role: 'Principal Architect &bull; Engineering', amount: '$8,450.00', status: 'W-4 Ready' },
        { name: 'Dr. Marcus Chen', role: 'Director of Clinical Research', amount: '$11,200.00', status: 'Verified' },
        { name: 'Sarah Jenkins', role: 'VP Global Operations', amount: '£6,780.00', status: 'Multi-Currency' }
      ]
    },
    'geofence': {
      badge: 'LOCATION INTELLIGENCE',
      title: 'Geofence Radar Sync & Time Fraud Prevention',
      desc: 'Deploy hyper-accurate virtual perimeters around job sites. Automatically track clock-ins, prevent buddy punching, and sync approved hours directly to the gross-to-net engine.',
      p1Val: '0.2s', p1Lbl: 'RADAR LATENCY', p1Sub: 'Real-time GPS sync',
      p2Val: '100%', p2Lbl: 'GEOFENCE SHIELD', p2Sub: 'Spoof-proof verification',
      p3Val: '0', p3Lbl: 'TIME THEFT', p3Sub: 'Cryptographic logs',
      highlights: [
        'Dynamic geofencing radii automatically adapt to specific project boundaries',
        'Biometric mobile sign-off requires FaceID or TouchID for remote punches',
        'Offline caching records punches without cell service and syncs upon reconnection'
      ],
      terminalMeta: 'LIVE_TELEMETRY // GEOFENCE_RADAR_V2.1',
      stat1Lbl: 'RADAR PINGS', stat1: '8,420 Daily',
      stat2Lbl: 'ACCURACY', stat2: '99.9% Matched',
      stat3Lbl: 'DISPUTES', stat3: '0 Flagged',
      ledger: [
        { name: 'James Wilson', role: 'Site Manager &bull; Project Alpha', amount: '08:00 AM', status: 'In-Bounds' },
        { name: 'Maria Garcia', role: 'Field Technician &bull; Sector 4', amount: '07:45 AM', status: 'In-Bounds' },
        { name: 'David Lee', role: 'Logistics Driver &bull; Route 12', amount: '09:12 AM', status: 'In-Bounds' }
      ]
    },
    'predictive': {
      badge: 'AI LABOR FORECASTING',
      title: 'Predictive Labor AI & Cost Variance Modeling',
      desc: 'Leverage machine learning algorithms to forecast seasonal labor costs, detect budget anomalies before pay cycles, and optimize shift scheduling for maximum ROI.',
      p1Val: '99.8%', p1Lbl: 'FORECAST ACCURACY', p1Sub: 'Machine learning trained',
      p2Val: '<1s', p2Lbl: 'VARIANCE SCAN', p2Sub: 'Instant budget matching',
      p3Val: '5yr', p3Lbl: 'DATA HORIZON', p3Sub: 'Historical model training',
      highlights: [
        'Proactive overtime alerts warn managers before shift limits are exceeded',
        'Automated departmental budget reconciliation against actual pay run data',
        'Interactive scenario planning for seasonal hiring and compensation adjustments'
      ],
      terminalMeta: 'LIVE_TELEMETRY // PREDICTIVE_AI_V4.0',
      stat1Lbl: 'ML MODEL', stat1: 'ARIMA-9 Sync',
      stat2Lbl: 'VARIANCE', stat2: '0.2% Error Margin',
      stat3Lbl: 'EFFICIENCY', stat3: 'Optimized',
      ledger: [
        { name: 'Q3 Forecast', role: 'Engineering Dept &bull; 140 Staff', amount: '$420K Est.', status: 'Under Budget' },
        { name: 'Q4 Seasonal', role: 'Logistics Dept &bull; 350 Staff', amount: '$850K Est.', status: 'On Target' },
        { name: 'Overtime Alert', role: 'Support Team &bull; High Volume', amount: '+$12K Var.', status: 'Reviewing' }
      ]
    },
    'governance': {
      badge: 'COMPLIANCE WORKFLOW',
      title: 'Multi-Tier Approval Routing & Cryptographic Sign-Off',
      desc: 'Build custom, conditional approval chains for executive payroll review. Ensure every outlier, bonus, and deduction passes through mandatory cryptographic signatures.',
      p1Val: 'AES-256', p1Lbl: 'ENCRYPTION', p1Sub: 'Military-grade vault',
      p2Val: 'Infinite', p2Lbl: 'ROUTING TIERS', p2Sub: 'Customizable chains',
      p3Val: 'SOC-2', p3Lbl: 'AUDIT TRAIL', p3Sub: 'Immutable ledger',
      highlights: [
        'Conditional logic routes approvals based on department, amount, or anomaly flags',
        'Cryptographic biometric sign-off via mobile app for executive on-the-go approvals',
        'Immutable audit logs record every review, edit, and timestamp for compliance'
      ],
      terminalMeta: 'LIVE_TELEMETRY // GOVERNANCE_GATE_V1.5',
      stat1Lbl: 'ACTIVE TIERS', stat1: '4 Routing Layers',
      stat2Lbl: 'PENDING', stat2: '2 Exec Reviews',
      stat3Lbl: 'AUDIT STATUS', stat3: '100% Compliant',
      ledger: [
        { name: 'Exec Bonus Pool', role: 'Q2 Disbursal &bull; Requires Board OK', amount: '$1.2M', status: 'Pending' },
        { name: 'Standard Run', role: 'Bi-Weekly Payroll &bull; HR Approved', amount: '$450K', status: 'Approved' },
        { name: 'Contractor Run', role: 'End of Month &bull; Finance Approved', amount: '$120K', status: 'Approved' }
      ]
    }
  };

  const badgeEl = document.getElementById('fspBadge');
  const titleEl = document.getElementById('fspTitle');
  const descEl = document.getElementById('fspDesc');
  const p1ValEl = document.getElementById('fspP1Val');
  const p1LblEl = document.getElementById('fspP1Lbl');
  const p1SubEl = document.getElementById('fspP1Sub');
  const p2ValEl = document.getElementById('fspP2Val');
  const p2LblEl = document.getElementById('fspP2Lbl');
  const p2SubEl = document.getElementById('fspP2Sub');
  const p3ValEl = document.getElementById('fspP3Val');
  const p3LblEl = document.getElementById('fspP3Lbl');
  const p3SubEl = document.getElementById('fspP3Sub');
  const hlEl = document.getElementById('fspHighlights');
  const termMetaEl = document.getElementById('fspTerminalMeta');
  
  const stat1LblEl = document.getElementById('fspStat1Lbl');
  const stat1El = document.getElementById('fspStat1');
  const stat2LblEl = document.getElementById('fspStat2Lbl');
  const stat2El = document.getElementById('fspStat2');
  const stat3LblEl = document.getElementById('fspStat3Lbl');
  const stat3El = document.getElementById('fspStat3');
  
  const ledgerEl = document.getElementById('fspLedgerFeed');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const tabKey = btn.getAttribute('data-tab');
      const data = dataMap[tabKey];
      if (!data) return;

      if (badgeEl) badgeEl.innerHTML = `<i class="fa-solid fa-sparkles"></i> ${data.badge}`;
      if (titleEl) titleEl.textContent = data.title;
      if (descEl) descEl.textContent = data.desc;
      
      if (p1ValEl) p1ValEl.textContent = data.p1Val;
      if (p1LblEl) p1LblEl.textContent = data.p1Lbl;
      if (p1SubEl) p1SubEl.textContent = data.p1Sub;
      
      if (p2ValEl) p2ValEl.textContent = data.p2Val;
      if (p2LblEl) p2LblEl.textContent = data.p2Lbl;
      if (p2SubEl) p2SubEl.textContent = data.p2Sub;
      
      if (p3ValEl) p3ValEl.textContent = data.p3Val;
      if (p3LblEl) p3LblEl.textContent = data.p3Lbl;
      if (p3SubEl) p3SubEl.textContent = data.p3Sub;

      if (hlEl) {
        hlEl.innerHTML = data.highlights.map(h => `
          <li><i class="fa-solid fa-circle-check text-accent"></i> <span>${h}</span></li>
        `).join('');
      }

      if (termMetaEl) termMetaEl.textContent = data.terminalMeta;
      
      if (stat1LblEl) stat1LblEl.textContent = data.stat1Lbl;
      if (stat1El) stat1El.textContent = data.stat1;
      if (stat2LblEl) stat2LblEl.textContent = data.stat2Lbl;
      if (stat2El) stat2El.textContent = data.stat2;
      if (stat3LblEl) stat3LblEl.textContent = data.stat3Lbl;
      if (stat3El) stat3El.textContent = data.stat3;

      if (ledgerEl) {
        ledgerEl.innerHTML = data.ledger.map(row => `
          <div class="tv-ledger-row">
            <div class="tl-avatar"><i class="fa-solid fa-user-check"></i></div>
            <div class="tl-info">
              <strong>${row.name}</strong>
              <span>${row.role}</span>
            </div>
            <div class="tl-amount text-accent">${row.amount}</div>
            <div class="tl-badge"><i class="fa-solid fa-check"></i> ${row.status}</div>
          </div>
        `).join('');
      }
    });
  });
}

/* 13. Section 9: Executive Spotlight Wall Controller */
function initExecutiveSpotlight() {
  const leaderItems = document.querySelectorAll('.leader-item');
  if (!leaderItems.length) return;

  const quoteText = document.getElementById('spotlightQuoteText');
  const authorName = document.getElementById('spotlightAuthorName');
  const authorTitle = document.getElementById('spotlightAuthorTitle');
  const authorImg = document.getElementById('spotlightAuthorImg');
  const companyBadge = document.getElementById('spotlightCompanyBadge');
  const companyName = document.getElementById('spotlightCompanyName');
  const metricVal = document.getElementById('spotlightMetricVal');
  const metricLbl = document.getElementById('spotlightMetricLbl');

  leaderItems.forEach((btn) => {
    btn.addEventListener('click', () => {
      leaderItems.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const quote = btn.getAttribute('data-quote');
      const author = btn.getAttribute('data-author');
      const role = btn.getAttribute('data-role');
      const company = btn.getAttribute('data-company');
      const icon = btn.getAttribute('data-icon');
      const img = btn.getAttribute('data-img');
      const metric = btn.getAttribute('data-metric');
      const metriclbl = btn.getAttribute('data-metriclbl');

      if (quoteText) {
        quoteText.style.opacity = '0';
        setTimeout(() => {
          quoteText.textContent = `"${quote}"`;
          quoteText.style.transition = 'opacity 0.3s ease';
          quoteText.style.opacity = '1';
        }, 150);
      }

      if (authorName) authorName.textContent = author;
      if (authorTitle) authorTitle.textContent = role;
      if (authorImg && img) authorImg.src = img;
      if (companyName) companyName.textContent = company;
      if (companyBadge && icon) {
        companyBadge.querySelector('i').className = `fa-solid ${icon} text-accent`;
      }
      if (metricVal) metricVal.textContent = metric;
      if (metricLbl) metricLbl.textContent = metriclbl;
    });
  });
}

/* 14. Section 4: Sovereign Assurance Bento Card Interactions */
function initAssuranceBentoTilt() {
  const cards = document.querySelectorAll('.assurance-bento-card, .assurance-hero-card');
  if (!cards.length) return;

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;

      if (typeof gsap !== 'undefined' && window.innerWidth >= 992) {
        gsap.to(card, {
          rotateY: deltaX * 3,
          rotateX: -deltaY * 3,
          duration: 0.35,
          ease: 'power1.out',
          transformPerspective: 1000
        });
      }
    });

    card.addEventListener('mouseleave', () => {
      if (typeof gsap !== 'undefined' && window.innerWidth >= 992) {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.5,
          ease: 'power2.out',
          clearProps: 'transform'
        });
      }
    });
  });
}

/* 16. Section 10: FAQ Topic Filter & Booking Slot Interactive Controller */
function initSection10Interactions() {
  // FAQ Topic Pills Filter
  const topicPills = document.querySelectorAll('.faq-filter-bar .faq-pill');
  const accordionItems = document.querySelectorAll('.cta-faq-section .accordion-item');

  if (topicPills.length && accordionItems.length) {
    topicPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        topicPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const target = pill.getAttribute('data-target');

        // If 'All Inquiries' (target 'all'), open first and keep all visible
        if (target === 'all' || target === null) {
          accordionItems.forEach((item, i) => {
            item.style.display = 'block';
            if (i === 0) {
              item.classList.add('active');
            } else {
              item.classList.remove('active');
            }
          });
        } else {
          const targetIdx = parseInt(target, 10);
          // Highlight relevant item and open it
          accordionItems.forEach((item, i) => {
            item.style.display = 'block';
            if (i === targetIdx) {
              item.classList.add('active');
              item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
              item.classList.remove('active');
            }
          });
        }
      });
    });
  }

  // Booking Terminal Slot Chips
  const slotChips = document.querySelectorAll('.slot-chips-grid .slot-chip');
  slotChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      slotChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });
}

/* 17. Section 8: Case Study Industry Filter Controller */
function initCaseStudyFilters() {
  const filterButtons = document.querySelectorAll('#caseStudyFilters .cs-filter-btn');
  const cards = document.querySelectorAll('.case-studies-grid .case-study-card');

  if (!filterButtons.length || !cards.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.getAttribute('data-category');

      cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (cat === 'all' || cardCat === cat) {
          card.style.display = 'flex';
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(card, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
          } else {
            card.style.opacity = '1';
          }
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* 18. Interactive ROI Calculator Controller */
function initRoiCalculator() {
  const employeeSlider = document.getElementById('calcEmployees');
  const wageSlider = document.getElementById('calcHourlyWage');
  const employeeValDisplay = document.getElementById('calcEmpDisplay');
  const wageValDisplay = document.getElementById('calcWageDisplay');
  const savingsDisplay = document.getElementById('calcSavingsResult');
  const hoursDisplay = document.getElementById('calcHoursResult');
  const errorRateDisplay = document.getElementById('calcErrorSavings');

  if (!employeeSlider || !wageSlider) return;

  const calculate = () => {
    const employees = parseInt(employeeSlider.value, 10);
    const wage = parseInt(wageSlider.value, 10);

    if (employeeValDisplay) employeeValDisplay.textContent = `${employees.toLocaleString()} Staff`;
    if (wageValDisplay) wageValDisplay.textContent = `$${wage}/hr`;

    // Formula based on typical enterprise metrics:
    // Legacy payroll manual processing costs ~ 4.2 hours per employee/year in overhead + error remediation
    // Aurelia reduces manual intervention by 92%
    const hoursSavedPerYear = Math.round(employees * 4.2 * 0.92);
    const directLaborSavings = Math.round(hoursSavedPerYear * wage);
    const penaltyShieldSavings = Math.round(employees * 125); // Estimated audit risk & multi-nexus penalty savings

    const totalAnnualSavings = directLaborSavings + penaltyShieldSavings;

    if (savingsDisplay) savingsDisplay.textContent = `$${totalAnnualSavings.toLocaleString()}`;
    if (hoursDisplay) hoursDisplay.textContent = `${hoursSavedPerYear.toLocaleString()} hrs`;
    if (errorRateDisplay) errorRateDisplay.textContent = `$${penaltyShieldSavings.toLocaleString()}`;
  };

  employeeSlider.addEventListener('input', calculate);
  wageSlider.addEventListener('input', calculate);
  calculate();
}

/* 19. Platform Cockpit Live Tab Switcher */
function initPlatformCockpitTabs() {
  const tabButtons = document.querySelectorAll('.cockpit-tabs-nav .cockpit-tab-btn');
  const cockpitScreens = document.querySelectorAll('.cockpit-view-screen');

  if (!tabButtons.length || !cockpitScreens.length) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.getAttribute('data-cockpit-tab');

      cockpitScreens.forEach(screen => {
        if (screen.getAttribute('data-screen-id') === targetTab) {
          screen.style.display = 'block';
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(screen, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
          } else {
            screen.style.opacity = '1';
          }
        } else {
          screen.style.display = 'none';
        }
      });
    });
  });
}

/* 20. Universal Accordions */
function initUniversalAccordions() {
  const accordions = document.querySelectorAll('.faq-item-modern');
  accordions.forEach(item => {
    const header = item.querySelector('.faq-header-modern, .accordion-question');
    if (!header) return;

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      
      // Close sibling items in the same container
      const parent = item.parentElement;
      if (parent) {
        parent.querySelectorAll('.accordion-item, .faq-item-modern').forEach(sib => {
          if (sib !== item) sib.classList.remove('active');
        });
      }

      if (isOpen) {
        item.classList.remove('active');
      } else {
        item.classList.add('active');
      }
    });
  });
}

/* 22. Services Page Interactive Controllers (Hero Engine, State Switcher, Sector Command) */
function initServicesInteractiveComponents() {
  // 1. Hero Calculation Engine Live Disbursal Simulator
  const triggerBtn = document.getElementById('triggerHeroSimulate');
  const calcStream = document.getElementById('heroCalcStream');
  if (triggerBtn && calcStream) {
    triggerBtn.addEventListener('click', () => {
      const origText = triggerBtn.innerHTML;
      triggerBtn.disabled = true;
      triggerBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Computing 4,800+ Tax Formulas...</span>';

      const rows = calcStream.querySelectorAll('.calc-stream-row');
      rows.forEach((r, idx) => {
        setTimeout(() => {
          r.style.transform = 'scale(1.02)';
          r.style.borderColor = 'var(--accent)';
          setTimeout(() => {
            r.style.transform = 'scale(1)';
            r.style.borderColor = '';
          }, 300);
        }, idx * 150);
      });

      setTimeout(() => {
        triggerBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> <span>$1,438,071.25 Disbursed in 14ms!</span>';
        triggerBtn.style.background = '#2e7d32';
        triggerBtn.style.color = '#ffffff';

        setTimeout(() => {
          triggerBtn.disabled = false;
          triggerBtn.innerHTML = origText;
          triggerBtn.style.background = '';
          triggerBtn.style.color = '';
        }, 3500);
      }, 900);
    });
  }

  // 2. State Tax Switcher in Service 01
  const stateButtons = document.querySelectorAll('.state-tax-tab-btn');
  const stateSpecPane = document.getElementById('stateTaxSpecPane');
  
  const stateData = {
    CA: {
      title: "California Multi-Tier Nexus",
      rate: "13.3% Top Marginal Bracket",
      sdi: "1.1% SDI (No Wage Cap in 2026)",
      ot: "Daily 8-Hr Overtime & 7th-Day Rule Auto-Calculated",
      status: "100% EDD Compliant"
    },
    NY: {
      title: "New York State & NYC Dual Nexus",
      rate: "10.9% NYS + 3.876% NYC Resident Tax",
      sdi: "MCTMT Mobility Tax & Paid Family Leave (PFL)",
      ot: "Weekly 40-Hr + Spread of Hours Rule Protected",
      status: "100% NY DTF Compliant"
    },
    TX: {
      title: "Texas Zero-Income Tax Shield",
      rate: "0.00% State Personal Income Tax",
      sdi: "Texas TWC Unemployment Tax Only (1.2% SUI)",
      ot: "Standard Federal FLSA 40-Hr Overtime Engine",
      status: "100% TWC Compliant"
    },
    IL: {
      title: "Illinois Flat Tax & Chicago Transit",
      rate: "4.95% Flat State Income Tax",
      sdi: "IDES State Unemployment & Chicago Head Tax Shield",
      ot: "One Day Rest in Seven Act (ODRISA) Auto-Tracked",
      status: "100% IDES Compliant"
    }
  };

  if (stateButtons.length && stateSpecPane) {
    stateButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        stateButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const stateCode = btn.getAttribute('data-state-code');
        const data = stateData[stateCode];
        if (data) {
          stateSpecPane.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <strong style="color: var(--secondary); font-size: 13px;">${data.title}</strong>
              <span class="badge badge-gold" style="font-size: 10px;">${data.status}</span>
            </div>
            <div style="font-family: var(--font-mono); font-size: 11px; color: rgba(252,250,246,0.75); line-height: 1.6;">
              <div>&bull; Marginal Rate: <span class="text-accent">${data.rate}</span></div>
              <div>&bull; State Disability / SUI: <span>${data.sdi}</span></div>
              <div>&bull; Overtime Engine: <span>${data.ot}</span></div>
            </div>
          `;
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(stateSpecPane, { opacity: 0, y: 5 }, { opacity: 1, y: 0, duration: 0.25 });
          }
        }
      });
    });
  }

  // 3. Sector Command Nexus Switchboard in Industries
  const sectorNavBtns = document.querySelectorAll('.sector-nav-btn');
  const sectorSpecContainer = document.getElementById('sectorSpecDisplayContainer');

  const sectorData = {
    healthcare: {
      title: "Healthcare Systems & Hospital Networks",
      icon: "fa-hospital",
      pill: "8/80 Rule & Shift Differentials",
      desc: "Handles 24/7 round-the-clock rotations, PRN per-diem nursing rosters, complex on-call hourly premiums, and California Title 22 nursing ratio compliance with automated FLSA Section 7(j) 8/80 overtime calculations.",
      bullet1: "Automated 8/80 hospital overtime calculations across bi-weekly cycles.",
      bullet2: "Night-shift, weekend, and charge nurse premium differential stacking.",
      bullet3: "Zero-error payroll synchronization with Epic & Cerner scheduling."
    },
    tech: {
      title: "Technology Enterprises & High-Growth SaaS",
      icon: "fa-laptop-code",
      pill: "50-State Remote Multi-Nexus",
      desc: "Calculates equity compensation tax withholdings on RSU vests and ISO cashless exercises, handles multi-state remote nomad nexus withholding across all 50 states, and executes instant global developer payments.",
      bullet1: "Instant statutory withholding on RSU vests and stock option exercises.",
      bullet2: "Automatic state tax nexus detection when remote engineers relocate.",
      bullet3: "Same-day off-cycle bonus payouts and equity ledger reconciliation."
    },
    hospitality: {
      title: "Hospitality, Fine Dining & Multi-Unit Retail",
      icon: "fa-utensils",
      pill: "Tip Credit & Instant Same-Day Pay",
      desc: "Manages complex tip pooling formulas, automated FICA tip credit (Form 8846) calculations, split-shift premiums, high employee turnover onboarding, and instant earned wage access (EWA) for frontline staff.",
      bullet1: "Automated Section 45B FICA tip tax credit calculation and reporting.",
      bullet2: "Daily shift-based tip pool distribution directly into employee debit cards.",
      bullet3: "Instant digital I-9 verification for seasonal and rapid-hire staff."
    },
    manufacturing: {
      title: "Manufacturing, Fabrication & Logistics",
      icon: "fa-industry",
      pill: "Union CBA Dues & Piece-Rate Engine",
      desc: "Supports multi-tiered union Collective Bargaining Agreement (CBA) pay scales, multi-shift differential weighting, hazardous duty premiums, and piece-rate statutory minimum wage reconciliations.",
      bullet1: "Complex multi-tier union CBA dues, pension trust, and PAC deductions.",
      bullet2: "Automated piece-rate gross-up ensuring strict FLSA minimum wage compliance.",
      bullet3: "Direct on-premise hardware turnstile punch synchronization."
    },
    education: {
      title: "Universities & Research Institutions",
      icon: "fa-graduation-cap",
      pill: "Grant Fund Accounting & Faculty Spreads",
      desc: "Manages federal research grant fund accounting allocations (Uniform Guidance 2 CFR 200), 9-month faculty academic pay spread over 12 months, and student employee FICA tax exemption rules (IRC Section 3121(b)(10)).",
      bullet1: "Multi-sponsor grant fund cost-center labor allocation and audit defense.",
      bullet2: "Flexible 9-month or 10-month faculty salary spreading across 12 months.",
      bullet3: "Automated student FICA tax exemption checks during enrolled terms."
    },
    finance: {
      title: "Private Equity, Asset Management & Banking",
      icon: "fa-landmark",
      pill: "Carried Interest & SOX 404 Audit Shield",
      desc: "Designed for high-compliance financial institutions, managing complex carried interest payouts, partner draw schedules, deferred compensation (Section 409A), and SOX 404 immutable dual-authorization audit trails.",
      bullet1: "SOX 404 compliant dual-custody approval workflows for executive payouts.",
      bullet2: "Partner distribution schedules and K-1 tax allocation support.",
      bullet3: "Cryptographic tamper-evident audit logs with named CPA lead review."
    }
  };

  if (sectorNavBtns.length && sectorSpecContainer) {
    sectorNavBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        sectorNavBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const sectorKey = btn.getAttribute('data-sector-key');
        const d = sectorData[sectorKey];
        if (d) {
          sectorSpecContainer.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-md); flex-wrap: wrap; gap: 10px;">
              <div style="display: flex; align-items: center; gap: 14px;">
                <div style="width: 48px; height: 48px; border-radius: var(--radius-sm); background: rgba(201,162,39,0.18); border: 1.5px solid var(--accent); display: flex; align-items: center; justify-content: center; color: var(--accent); font-size: 22px;">
                  <i class="fa-solid ${d.icon}"></i>
                </div>
                <div>
                  <h3 style="font-size: 1.4rem; color: var(--secondary); font-weight: 700;">${d.title}</h3>
                  <span style="font-size: 12px; color: rgba(252,250,246,0.6); font-family: var(--font-mono);">AURELIA TAILORED SECTOR MODULE</span>
                </div>
              </div>
              <span class="badge badge-gold">${d.pill}</span>
            </div>

            <p style="font-size: 14px; color: rgba(252,250,246,0.85); line-height: 1.7; margin-bottom: var(--space-lg);">
              ${d.desc}
            </p>

            <div style="background: rgba(0,0,0,0.35); border: 1px solid rgba(201,162,39,0.22); border-radius: var(--radius-md); padding: var(--space-md); margin-bottom: var(--space-lg);">
              <div style="font-family: var(--font-mono); font-size: 11px; color: var(--accent); margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.05em;">
                <i class="fa-solid fa-code-branch"></i> Statutory Logic & Regulatory Compliance Engine:
              </div>
              <ul style="list-style: none; padding: 0; margin: 0; font-size: 13px; color: rgba(252,250,246,0.85);">
                <li style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                  <i class="fa-solid fa-check text-accent"></i> ${d.bullet1}
                </li>
                <li style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                  <i class="fa-solid fa-check text-accent"></i> ${d.bullet2}
                </li>
                <li style="display: flex; align-items: center; gap: 10px;">
                  <i class="fa-solid fa-check text-accent"></i> ${d.bullet3}
                </li>
              </ul>
            </div>

            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
              <a href="contact.html" class="btn btn-accent btn-sm btn-magnetic">
                <i class="fa-solid fa-file-signature"></i>
                <span>Request ${d.title.split(' ')[0]} Architecture Brief</span>
              </a>
            </div>
          `;
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(sectorSpecContainer, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
          }
        }
      });
    });
  }
}

/* 23. Pipeline Stepper Controller for services.html */
function initPipelineStepper() {
  const stepBtns = document.querySelectorAll('.pipeline-step-btn');
  const stagePanes = document.querySelectorAll('.pipeline-stage-pane');

  if (!stepBtns.length || !stagePanes.length) return;

  stepBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetStage = btn.getAttribute('data-stage');
      if (!targetStage) return;

      // Update buttons
      stepBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update panes
      stagePanes.forEach(pane => {
        if (pane.id === targetStage) {
          pane.classList.add('active');
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(pane, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
          }
        } else {
          pane.classList.remove('active');
        }
      });
    });
  });
}

/* 24. Architectural Capability Matrix Tabs for services.html */
function initArchMatrixTabs() {
  const tabs = document.querySelectorAll('.arch-matrix-tab-btn');
  const panels = document.querySelectorAll('.arch-matrix-panel');

  if (!tabs.length || !panels.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-matrix-target');
      if (!targetId) return;

      // Update active state on buttons
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update active state on panels
      panels.forEach(panel => {
        if (panel.id === targetId) {
          panel.classList.add('active');
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(panel, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
          }
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });
}

/* 25. Immersive Industry Showcase Background/Tab Controller */
function initImmersiveIndustryTabs() {
  const pills = document.querySelectorAll('.ind-pill-btn');
  const bgLayers = document.querySelectorAll('.industry-bg-layer');
  const specs = document.querySelectorAll('.ind-glass-spec');

  if (!pills.length || !bgLayers.length || !specs.length) return;

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const targetId = pill.getAttribute('data-ind-target');
      if (!targetId) return;
      
      const targetBgId = targetId.replace('ind-', 'bg-');

      // 1. Update pills
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      // 2. Update background layers
      bgLayers.forEach(bg => {
        if (bg.id === targetBgId) {
          bg.classList.add('active');
        } else {
          bg.classList.remove('active');
        }
      });

      // 3. Update spec panels
      specs.forEach(spec => {
        if (spec.id === targetId) {
          spec.classList.add('active');
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(spec, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
          }
        } else {
          spec.classList.remove('active');
        }
      });
    });
  });
}

/* 26. Core Engine Console (Section 3) */
function initCoreEngineConsole() {
  const navBtns = document.querySelectorAll('.engine-nav-btn');
  const modules = document.querySelectorAll('.engine-module-view');

  if (!navBtns.length || !modules.length) return;

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-engine-target');
      if (!targetId) return;

      // Update buttons
      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update modules
      modules.forEach(mod => {
        if (mod.id === targetId) {
          mod.classList.add('active');
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(mod, { opacity: 0, y: 15, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' });
          }
        } else {
          mod.classList.remove('active');
        }
      });
    });
  });
}

/* 27. Expanding Horizontal Image Accordion (Section 4) */
function initIndustryAccordion() {
  const panels = document.querySelectorAll('.industry-panel');
  
  if (!panels.length) return;

  panels.forEach(panel => {
    panel.addEventListener('click', () => {
      // Remove active class from all
      panels.forEach(p => p.classList.remove('active'));
      
      // Add active to clicked
      panel.classList.add('active');
    });

    // Hover for desktop
    panel.addEventListener('mouseenter', () => {
      if (window.innerWidth >= 992) {
        panels.forEach(p => p.classList.remove('active'));
        panel.classList.add('active');
      }
    });
  });
}
