// Global Chart.js font settings
Chart.defaults.font.family = 'Vazir, sans-serif';
Chart.defaults.font.size = 14;

// Responsive font sizes for different screen sizes
Chart.defaults.font.size = window.innerWidth < 768 ? 12 : 14;

// Plugin defaults
Chart.defaults.plugins.legend.labels.font = {
  family: 'Vazir, sans-serif',
  size: 14
};

Chart.defaults.plugins.tooltip.titleFont = {
  family: 'Vazir, sans-serif',
  size: 16,
  weight: 'bold'
};

Chart.defaults.plugins.tooltip.bodyFont = {
  family: 'Vazir, sans-serif',
  size: 14
};

// RTL support for tooltips based on HTML dir attribute
const isRTL = document.documentElement.dir === 'rtl';
Chart.defaults.plugins.tooltip.textDirection = isRTL ? 'rtl' : 'ltr';
Chart.defaults.plugins.tooltip.rtl = isRTL;
if (isRTL) {
  Chart.defaults.plugins.tooltip.titleAlign = 'left';
  Chart.defaults.plugins.tooltip.bodyAlign = 'left';
  Chart.defaults.plugins.tooltip.footerAlign = 'left';
}

// Scale defaults
Chart.defaults.scale.ticks.font = {
  family: 'Vazir, sans-serif',
  size: 12
};

// Responsive adjustments
window.addEventListener('resize', function () {
  Chart.defaults.font.size = window.innerWidth < 768 ? 12 : 14;
  Chart.defaults.plugins.legend.labels.font.size = window.innerWidth < 768 ? 12 : 14;
  Chart.defaults.plugins.tooltip.titleFont.size = window.innerWidth < 768 ? 14 : 16;
  Chart.defaults.plugins.tooltip.bodyFont.size = window.innerWidth < 768 ? 12 : 14;
  Chart.defaults.scale.ticks.font.size = window.innerWidth < 768 ? 10 : 12;
});
