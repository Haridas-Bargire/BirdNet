const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const topbarClose = document.querySelector('.topbar-close');
const topbar = document.querySelector('.site-topbar');
const revealItems = document.querySelectorAll('.reveal');
const enquiryForm = document.getElementById('enquiryForm');
const faqItems = document.querySelectorAll('.faq-item');
const modal = document.getElementById('galleryModal');
const modalImage = document.getElementById('modalImage');
const galleryItems = document.querySelectorAll('.gallery-item');
const modalClose = document.querySelector('.modal-close');
const modalPrev = document.querySelector('.modal-prev');
const modalNext = document.querySelector('.modal-next');

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

if (header) {
  const handleHeaderShadow = () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  };

  handleHeaderShadow();
  window.addEventListener('scroll', handleHeaderShadow);
}

if (topbarClose && topbar) {
  topbarClose.addEventListener('click', () => {
    topbar.style.display = 'none';
  });
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

faqItems.forEach((item) => {
  const button = item.querySelector('.faq-question');
  button.addEventListener('click', () => {
    const isOpen = item.classList.contains('active');
    faqItems.forEach((faq) => {
      faq.classList.remove('active');
    });

    if (!isOpen) {
      item.classList.add('active');
    }
  });
});

let currentImageIndex = 0;
const galleryImages = [...galleryItems].map((item) => ({
  src: item.dataset.image,
  alt: item.querySelector('img')?.alt || 'Gallery image'
}));

const openModal = (index) => {
  if (!modal || !modalImage || !galleryImages.length) return;
  currentImageIndex = index;
  modalImage.src = galleryImages[index].src;
  modalImage.alt = galleryImages[index].alt;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
};

const closeModal = () => {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
};

const moveModal = (direction) => {
  if (!galleryImages.length) return;
  const nextIndex = (currentImageIndex + direction + galleryImages.length) % galleryImages.length;
  openModal(nextIndex);
};

galleryItems.forEach((item, index) => {
  item.addEventListener('click', () => openModal(index));
  item.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openModal(index);
    }
  });
  item.setAttribute('tabindex', '0');
});

if (modalClose) {
  modalClose.addEventListener('click', closeModal);
}

if (modalPrev) {
  modalPrev.addEventListener('click', () => moveModal(-1));
}

if (modalNext) {
  modalNext.addEventListener('click', () => moveModal(1));
}

if (modal) {
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
}

document.addEventListener('keydown', (event) => {
  if (modal && modal.classList.contains('open')) {
    if (event.key === 'Escape') closeModal();
    if (event.key === 'ArrowRight') moveModal(1);
    if (event.key === 'ArrowLeft') moveModal(-1);
  }
});

if (enquiryForm) {
  enquiryForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const service = document.getElementById('serviceSelect').value.trim();
    const area = document.getElementById('serviceArea').value.trim();
    const requirement = document.getElementById('requirement').value.trim();

    const phoneRegex = /^[6-9]\d{9}$/;

    if (!fullName || !phoneNumber || !service || !requirement) {
      alert('Please fill in all required fields.');
      return;
    }

    if (!phoneRegex.test(phoneNumber)) {
      alert('Please enter a valid 10-digit Indian phone number.');
      return;
    }

    const message = `Hello OM Bird Netting Services,\n\nName: ${fullName}\nPhone: ${phoneNumber}\nService: ${service}\nArea: ${area || 'Not specified'}\nRequirement: ${requirement}\n\nI would like to get a quotation.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/917499148475?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank', 'noopener');
    enquiryForm.reset();
  });
}
