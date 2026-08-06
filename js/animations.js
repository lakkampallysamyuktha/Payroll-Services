/* ══════════════════════════════════════════════════════════════
   GSAP 3, SCROLLTRIGGER & VISIBILITY ENGINE
   ══════════════════════════════════════════════════════════════ */

function initializeAllAnimations() {
  // Register GSAP plugins if available
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Clean up old ScrollTriggers if any (prevents memory leaks on SPA or multiple calls)
    ScrollTrigger.getAll().forEach(t => t.kill());

    // Use MatchMedia for Responsive Animations
    let mm = gsap.matchMedia();

    // Desktop/Tablet Animations (min-width: 768px)
    mm.add("(min-width: 768px)", () => {
      initHeroEntranceAnimation();
      initTimelineLaserAnimation();
      initParallaxElements();
      
      // Generic
      initHoverFloat();
    });

    // Mobile Animations (max-width: 767px) - Simplified to save performance
    mm.add("(max-width: 767px)", () => {
      initHeroEntranceAnimationMobile();
    });

    // Global animations regardless of screen size
    initStatsCounterAnimation();
    
    // Generic Global GSAP Animations
    initGenericStaggers();
    initGenericScaleIn();
    initGenericReveals();
  }

  // Initialize AOS (Animate On Scroll) for the entire website
  if (typeof AOS !== 'undefined') {
    // Check if it's already initialized if needed, though init is usually idempotent 
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
      delay: 50,
      disableMutationObserver: false
    });

    // Refresh AOS on load and resize to prevent layout shifts
    window.addEventListener('load', () => {
      AOS.refresh();
      if(typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        AOS.refresh();
        if(typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      }, 250);
    });
  }
}

// Ensure it runs even if the DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAllAnimations);
} else {
  initializeAllAnimations();
}

/* ══════════════════════════════════════════════════════════════
   GENERIC GSAP ANIMATIONS (REUSABLE ACROSS PAGES)
   ══════════════════════════════════════════════════════════════ */

function initGenericStaggers() {
  const containers = document.querySelectorAll('.gsap-stagger-container');
  containers.forEach(container => {
    const items = container.querySelectorAll('.gsap-stagger-item');
    if (!items.length) return;
    
    gsap.from(items, {
      scrollTrigger: {
        trigger: container,
        start: 'top 85%',
        once: true
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      clearProps: "all"
    });
  });
}

function initGenericScaleIn() {
  const elements = document.querySelectorAll('.gsap-scale-in');
  elements.forEach(el => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true
      },
      scale: 0.9,
      opacity: 0,
      duration: 0.8,
      ease: 'back.out(1.2)',
      clearProps: "all"
    });
  });
}

function initGenericReveals() {
  const elements = document.querySelectorAll('.gsap-reveal');
  elements.forEach(el => {
    const direction = el.getAttribute('data-gsap-dir') || 'up'; // up, down, left, right
    let vars = { opacity: 0, duration: 0.8, ease: 'power2.out', clearProps: "all" };
    
    if (direction === 'up') vars.y = 40;
    else if (direction === 'down') vars.y = -40;
    else if (direction === 'left') vars.x = 40;
    else if (direction === 'right') vars.x = -40;

    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true
      },
      ...vars
    });
  });
}

function initHoverFloat() {
  const elements = document.querySelectorAll('.gsap-hover-float');
  elements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(el, { y: -8, duration: 0.4, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { y: 0, duration: 0.5, ease: 'power2.out' });
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   SPECIFIC PAGE ANIMATIONS (HOME, SERVICES, ETC)
   ══════════════════════════════════════════════════════════════ */

/* 1. Hero Entrance Animation */
function initHeroEntranceAnimation() {
  const heroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });

  const heroBadge = document.querySelector('.hero-badge');
  const heroTitle = document.querySelector('.hero-title');
  const heroDesc = document.querySelector('.hero-description');
  const heroBtns = document.querySelectorAll('.hero-cta-group .btn');
  const heroTrust = document.querySelector('.hero-trust-proof');
  const heroRiver = document.querySelector('.hero-river-deck');

  if (heroBadge) heroTL.from(heroBadge, { opacity: 0, y: -20, duration: 0.7, delay: 0.15 });
  if (heroTitle) heroTL.from(heroTitle, { opacity: 0, y: 30, duration: 0.85 }, '-=0.4');
  if (heroDesc) heroTL.from(heroDesc, { opacity: 0, y: 20, duration: 0.75 }, '-=0.5');
  if (heroBtns.length) heroTL.from(heroBtns, { opacity: 0, y: 20, stagger: 0.12, duration: 0.65 }, '-=0.5');
  if (heroTrust) heroTL.from(heroTrust, { opacity: 0, duration: 0.7 }, '-=0.4');
  if (heroRiver) heroTL.from(heroRiver, { opacity: 0, scale: 0.96, duration: 0.9, ease: 'power2.out' }, '-=0.6');
}

function initHeroEntranceAnimationMobile() {
  const heroTL = gsap.timeline({ defaults: { ease: 'power2.out' } });
  const heroTitle = document.querySelector('.hero-title');
  const heroRiver = document.querySelector('.hero-river-deck');
  
  if (heroTitle) heroTL.from(heroTitle, { opacity: 0, y: 20, duration: 0.6, delay: 0.1 });
  if (heroRiver) heroTL.from(heroRiver, { opacity: 0, duration: 0.6 }, '-=0.2');
}

/* 2. Live Stats Number Counter Animation */
function initStatsCounterAnimation() {
  const statElements = document.querySelectorAll('.stat-number[data-target]');
  statElements.forEach((stat) => {
    const targetValue = parseFloat(stat.getAttribute('data-target'));
    const isDecimal = stat.getAttribute('data-decimal') === 'true';
    const decimals = parseInt(stat.getAttribute('data-decimals') || (isDecimal ? '2' : '0'), 10);
    const prefix = stat.getAttribute('data-prefix') || '';
    const suffix = stat.getAttribute('data-suffix') || '';

    ScrollTrigger.create({
      trigger: stat,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: targetValue,
          duration: 2.0,
          ease: 'power2.out',
          onUpdate: function () {
            const current = this.targets()[0].val;
            stat.textContent = prefix + (isDecimal ? current.toFixed(decimals) : Math.floor(current).toLocaleString()) + suffix;
          }
        });
      }
    });
  });
}

/* 3. Continuous Transit Laser Line Indicator */
function initTimelineLaserAnimation() {
  const runway = document.querySelector('.transit-pipeline-runway');
  const wire = document.querySelector('.transit-laser-wire');
  const stations = document.querySelectorAll('.transit-station-row');

  if (!runway || !wire) return;

  ScrollTrigger.create({
    trigger: runway,
    start: 'top 75%',
    end: 'bottom 85%',
    scrub: 0.5,
    onUpdate: (self) => {
      wire.style.height = `${self.progress * 100}%`;
    }
  });

  stations.forEach((station) => {
    ScrollTrigger.create({
      trigger: station,
      start: 'top 70%',
      onEnter: () => station.classList.add('active'),
      onLeaveBack: () => station.classList.remove('active')
    });
  });
}

/* 4. Subtle Parallax Mouse Movement */
function initParallaxElements() {
  const floatingElements = document.querySelectorAll('.floating-node');
  if (!floatingElements.length) return;

  window.addEventListener('mousemove', (e) => {
    const mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
    const mouseY = (e.clientY / window.innerHeight - 0.5) * 20;

    floatingElements.forEach((el, idx) => {
      const factor = (idx + 1) * 0.3;
      gsap.to(el, {
        x: mouseX * factor,
        y: mouseY * factor,
        duration: 1.2,
        ease: 'power1.out'
      });
    });
  });
}
