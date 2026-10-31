document.addEventListener('DOMContentLoaded', () => {

  // Parse URL parameters
  const params = new URLSearchParams(window.location.search);
  const name = params.get('name') || 'Guest';
  const role = params.get('role') || 'Software Developer';
  const desc = params.get('desc') || 'Welcome to my portfolio.';
  const skillsText = params.get('skills') || 'HTML, CSS, JavaScript';

  // Update DOM elements
  document.getElementById('navName').textContent = name;
  document.getElementById('heroName').textContent = name;
  document.getElementById('heroRole').textContent = role;
  document.getElementById('heroDesc').textContent = desc;

  document.getElementById('aboutRole').textContent = role;
  document.getElementById('aboutDesc').textContent = desc;
  document.getElementById('aboutInitial').textContent = name.charAt(0).toUpperCase();

  document.title = `${name} | Portfolio`;

  // Parse skills and render
  const skills = skillsText.split(',').map(s => s.trim()).filter(s => s);
  const skillsList = document.getElementById('skillsList');
  skillsList.innerHTML = '';

  skills.forEach(skill => {
    const span = document.createElement('span');
    span.className = 'skill-badge';
    span.style.fontSize = '1.1rem';
    span.style.padding = '10px 20px';
    span.textContent = skill;
    skillsList.appendChild(span);
  });

  // Simple scroll reveal (same as main site)
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

  revealElements.forEach(el => revealObserver.observe(el));

  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

});
