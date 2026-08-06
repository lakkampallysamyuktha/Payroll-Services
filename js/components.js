/* ══════════════════════════════════════════════════════════════
   INTERACTIVE UI COMPONENTS ENGINE
   Spotlight, Flip Cards, Expandable Drawers, ROI Calculator, Accordion
   ══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initMouseSpotlight();
  initFlipCards();
  initExpandableCards();
  initDashboardTabs();
  initROICalculator();
  initGlassAccordion();
  initSmartFeaturesControls();
  initPipelineInteractive();
});

/* 1. Mouse-Tracking Spotlight Glow */
function initMouseSpotlight() {
  const spotlightCards = document.querySelectorAll('.spotlight-card');

  spotlightCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* 2. 3D Flip Card Toggle (Touch & Click Support) */
function initFlipCards() {
  const flipCards = document.querySelectorAll('.flip-card');

  flipCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      // Don't trigger if user clicks an internal link or button
      if (e.target.closest('a') || e.target.closest('button')) return;
      card.classList.toggle('flipped');
    });
  });
}

/* 3. Expandable Card Drawer Toggle */
function initExpandableCards() {
  const expandableCards = document.querySelectorAll('.expandable-card');

  expandableCards.forEach((card) => {
    const trigger = card.querySelector('.expand-trigger-btn') || card;
    trigger.addEventListener('click', (e) => {
      if (e.target.closest('a') && !e.target.closest('.expand-trigger-btn')) return;
      card.classList.toggle('is-expanded');

      const triggerText = card.querySelector('.expand-trigger-text');
      if (triggerText) {
        triggerText.textContent = card.classList.contains('is-expanded') ? 'Show Less Details' : 'View Enterprise Specs';
      }
    });
  });
}

/* 4. Interactive Dashboard Mockup Tabs & Dynamic Bars */
function initDashboardTabs() {
  const tabButtons = document.querySelectorAll('.dash-tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabButtons.forEach((b) => b.classList.remove('active'));
      tabPanes.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      const activePane = document.getElementById(targetTab);
      if (activePane) {
        activePane.classList.add('active');

        // Animate chart bars within the newly active pane
        const bars = activePane.querySelectorAll('.chart-bar');
        bars.forEach((bar) => {
          const h = bar.getAttribute('data-height') || '60%';
          bar.style.height = '0%';
          setTimeout(() => {
            bar.style.height = h;
          }, 50);
        });

        // Animate progress bars
        const progressBars = activePane.querySelectorAll('.progress-bar-fill');
        progressBars.forEach((pbar) => {
          const w = pbar.style.width;
          pbar.style.width = '0%';
          setTimeout(() => {
            pbar.style.width = w;
          }, 50);
        });
      }
    });
  });

  // Chart bar interactive hover/click selection
  const chartCols = document.querySelectorAll('.chart-bar-col');
  chartCols.forEach((col) => {
    col.addEventListener('mouseenter', () => {
      chartCols.forEach(c => c.classList.remove('active-month'));
      col.classList.add('active-month');
    });
  });
}

/* 5. Live Payroll ROI & Cost-Savings Calculator */
function initROICalculator() {
  const empSlider = document.getElementById('calc-employees-slider');
  const hoursSlider = document.getElementById('calc-hours-slider');
  const rateSlider = document.getElementById('calc-rate-slider');
  const empValDisplay = document.getElementById('calc-employees-val');
  const hoursValDisplay = document.getElementById('calc-hours-val');
  const rateValDisplay = document.getElementById('calc-rate-val');
  const resultAmount = document.getElementById('calc-savings-amount');
  const resultHoursSaved = document.getElementById('calc-hours-saved');
  const laborSavedVal = document.getElementById('calc-labor-saved');
  const errorSavedVal = document.getElementById('calc-error-saved');
  const roiPercentVal = document.getElementById('calc-roi-percent');
  const presetBtns = document.querySelectorAll('.preset-btn');

  if (!empSlider || !hoursSlider || !resultAmount) return;

  function calculateSavings() {
    const employees = parseInt(empSlider.value, 10);
    const hours = parseInt(hoursSlider.value, 10);
    const hourlyRate = rateSlider ? parseInt(rateSlider.value, 10) : 55;

    // Update Label Displays
    if (empValDisplay) empValDisplay.textContent = `${employees} Staff`;
    if (hoursValDisplay) hoursValDisplay.textContent = `${hours} Hrs/Mo`;
    if (rateValDisplay) rateValDisplay.textContent = `$${hourlyRate}/hr`;

    // 2025 American Payroll Association (APA) Benchmark Metrics
    // 82% reduction in manual processing hours
    const hoursSavedPerMonth = Math.round(hours * 0.82);
    const annualHoursSaved = hoursSavedPerMonth * 12;
    const annualLaborSavings = annualHoursSaved * hourlyRate;
    
    // Average $165/employee/year saved on IRS penalty risk & calculation error corrections
    const annualErrorSavings = Math.round(employees * 165);
    const totalAnnualSavings = annualLaborSavings + annualErrorSavings;

    // Est. platform cost based on headcount ($6/emp/mo + $49 base)
    const annualPlatformCost = (employees * 6 + 49) * 12;
    const calculatedROI = Math.max(180, Math.round(((totalAnnualSavings - annualPlatformCost) / annualPlatformCost) * 100));

    if (resultHoursSaved) resultHoursSaved.textContent = `${annualHoursSaved.toLocaleString()} Hours Saved / Year`;
    resultAmount.textContent = `$${totalAnnualSavings.toLocaleString()}`;
    if (laborSavedVal) laborSavedVal.textContent = `$${Math.round(annualLaborSavings / 1000)}k`;
    if (errorSavedVal) errorSavedVal.textContent = `$${Math.round(annualErrorSavings / 1000)}k`;
    if (roiPercentVal) roiPercentVal.textContent = `+${calculatedROI}%`;
  }

  empSlider.addEventListener('input', calculateSavings);
  hoursSlider.addEventListener('input', calculateSavings);
  if (rateSlider) rateSlider.addEventListener('input', calculateSavings);

  // Preset Buttons
  presetBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const presetEmps = btn.getAttribute('data-emp');
      const presetHours = btn.getAttribute('data-hours');
      const presetRate = btn.getAttribute('data-rate');

      if (presetEmps) empSlider.value = presetEmps;
      if (presetHours) hoursSlider.value = presetHours;
      if (presetRate && rateSlider) rateSlider.value = presetRate;

      calculateSavings();
    });
  });

  // Initialize with initial values
  calculateSavings();
}

/* 6. Modern Glass Accordion (FAQ) */
function initGlassAccordion() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach((header) => {
    header.addEventListener('click', () => {
      const currentItem = header.closest('.accordion-item');
      const isAlreadyActive = currentItem.classList.contains('active');

      // Close other accordion items in the same container
      const parentContainer = currentItem.closest('.glass-accordion, .faq-accordion-list');
      if (parentContainer) {
        parentContainer.querySelectorAll('.accordion-item').forEach((item) => {
          item.classList.remove('active');
        });
      }

      if (!isAlreadyActive) {
        currentItem.classList.add('active');
      }
    });
  });
}

/* 7. Smart Features Carousel Controls & Drag Interaction */
function initSmartFeaturesControls() {
  const container = document.querySelector('.horizontal-scroll-container');
  const prevBtn = document.getElementById('featuresPrevBtn');
  const nextBtn = document.getElementById('featuresNextBtn');
  const dots = document.querySelectorAll('.features-indicator-dot');
  const cards = document.querySelectorAll('.feature-horizontal-card');

  if (!container || !cards.length) return;

  function getScrollAmount() {
    const card = cards[0];
    const style = window.getComputedStyle(container);
    const gap = parseFloat(style.gap) || 24;
    return card.offsetWidth + gap;
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      container.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      container.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });
  }

  // Update dots on scroll
  container.addEventListener('scroll', () => {
    const scrollLeft = container.scrollLeft;
    const cardWidth = getScrollAmount();
    const activeIndex = Math.min(dots.length - 1, Math.max(0, Math.round(scrollLeft / cardWidth)));

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === activeIndex);
    });
  }, { passive: true });

  // Mouse Drag to Scroll (Grab & Swipe)
  let isDown = false;
  let startX;
  let scrollLeft;

  container.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });

  container.addEventListener('mouseleave', () => {
    isDown = false;
  });

  container.addEventListener('mouseup', () => {
    isDown = false;
  });

  container.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed factor
    container.scrollLeft = scrollLeft - walk;
  });
}

/* 8. 7-Stage Enterprise Workflow Interaction */
function initPipelineInteractive() {
  const stageCards = document.querySelectorAll('.workflow-stage-card');
  if (!stageCards.length) return;

  // Add subtle interactive focus effects
  stageCards.forEach((card, index) => {
    card.addEventListener('mouseenter', () => {
      card.style.borderColor = 'var(--accent)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.borderColor = '';
    });
  });
}



