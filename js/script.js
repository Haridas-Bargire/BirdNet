const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const header = document.querySelector('.site-header');
const revealItems = document.querySelectorAll('.reveal');
const enquiryForm = document.getElementById('enquiryForm');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isExpanded));
    navMenu.classList.toggle('open');
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const handleScroll = () => {
  if (window.scrollY > 20) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
};

if (header) {
  handleScroll();
  window.addEventListener('scroll', handleScroll);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealItems.forEach((item) => observer.observe(item));

if (enquiryForm) {
  enquiryForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(enquiryForm);
    const name = (formData.get('name') || '').toString().trim();
    const phone = (formData.get('phone') || '').toString().trim();
    const service = (formData.get('service') || '').toString().trim();
    const message = (formData.get('message') || '').toString().trim();

    const whatsappMessage = `Hello OM Bird Netting Services, I would like to enquire about ${service}. My name is ${name}. My phone number is ${phone}. Message: ${message}.`;
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/917499148475?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank', 'noopener');
    enquiryForm.reset();
  });
}
