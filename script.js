document.addEventListener('DOMContentLoaded', () => {

  // Navbar Scroll Effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Reveal Elements on Scroll
  const revealElements = document.querySelectorAll('.reveal');

  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Stop observing once revealed
        observer.unobserve(entry.target);
      }
    });
  };

  const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

});

// Job Modal Logic
const jobModal = document.getElementById('jobModal');
const modalJobTitle = document.getElementById('modalJobTitle');

function openJobModal(role) {
  modalJobTitle.value = role;
  jobModal.classList.add('active');
}

function closeJobModal() {
  jobModal.classList.remove('active');
}

function submitJob(event) {
  event.preventDefault();

  const form = event.target;
  const btn = form.querySelector('button[type="submit"]');
  const ogText = btn.innerText;

  btn.innerText = "Applying...";
  btn.disabled = true;

  const formData = new FormData(form);

  fetch('api_submit_job.php', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {

    if (data.status === 'success') {

      btn.innerText = "Application Sent!";

      setTimeout(() => {
        form.reset();
        closeJobModal();

        btn.innerText = ogText;
        btn.disabled = false;
      }, 1500);

    } else {

      alert(data.message);

      btn.innerText = ogText;
      btn.disabled = false;
    }

  })
  .catch(error => {

    console.error(error);

    alert("Connection Error");

    btn.innerText = ogText;
    btn.disabled = false;
  });
}
// Custom Portfolios Logic
const portfolioModal = document.getElementById('portfolioModal');
let deletedDefaults = JSON.parse(localStorage.getItem('deletedDefaults') || '[]');

function openPortfolioModal() {
  if (currentUser) {
    portfolioModal.classList.add('active');
  } else {
    openAuthModal();
  }
}

function closePortfolioModal() {
  portfolioModal.classList.remove('active');
}

function submitPortfolio(event) {
  event.preventDefault();
  const form = event.target;
  const btn = form.querySelector('button[type="submit"]');

  // Get values
  const name = document.getElementById('newPortName').value;
  const role = document.getElementById('newPortRole').value;
  const desc = document.getElementById('newPortDesc').value;
  const skillsText = document.getElementById('newPortSkills').value;

  btn.innerText = "Adding...";
  btn.disabled = true;

  fetch('api_add_portfolio.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, role, desc, skillsText })
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success') {
      const newPortfolio = {
        id: data.id,
        name,
        role,
        desc,
        skillsText
      };
      
      renderCustomPortfolio(newPortfolio);
      
      closePortfolioModal();
      form.reset();
    } else {
      alert("Error adding portfolio: " + data.message);
    }
    btn.innerText = "Add Portfolio";
    btn.disabled = false;
  })
  .catch(err => {
    console.error(err);
    alert("Connection Error");
    btn.innerText = "Add Portfolio";
    btn.disabled = false;
  });
}

function deletePortfolio(id) {
  if (id === 'seham' || id === 'amelia') {
    // Keep local storage for default removals
    if (!deletedDefaults.includes(id)) {
      deletedDefaults.push(id);
      localStorage.setItem('deletedDefaults', JSON.stringify(deletedDefaults));
    }
    const cardToRemove = document.getElementById(`portfolio-${id}`);
    if (cardToRemove) {
      cardToRemove.remove();
    }
  } else {
    // Delete from DB logic
    if (confirm("Are you sure you want to delete this portfolio?")) {
      fetch('api_delete_portfolio.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          const cardToRemove = document.getElementById(`portfolio-${id}`);
          if (cardToRemove) {
            cardToRemove.remove();
          }
        } else {
          alert("Could not delete: " + data.message);
        }
      });
    }
  }
}

let userPortfolios = [];

function openUpdatePortfolioModal() {
  if (currentUser) {
    fetch('api_get_user_portfolios.php')
      .then(res => res.json())
      .then(data => {
        userPortfolios = data;
        const select = document.getElementById('updatePortSelect');
        select.innerHTML = '';
        if (data.length === 0) {
          alert("You don't have any portfolios to update.");
          return;
        }
        data.forEach(p => {
          const opt = document.createElement('option');
          opt.value = p.id;
          opt.innerText = p.name;
          select.appendChild(opt);
        });
        loadSelectedPortfolioForUpdate();
        document.getElementById('updatePortfolioModal').classList.add('active');
      });
  } else {
    openAuthModal();
  }
}

function loadSelectedPortfolioForUpdate() {
  const select = document.getElementById('updatePortSelect');
  if (!select) return;
  const selectedId = select.value;
  const p = userPortfolios.find(x => x.id == selectedId);
  if (p) {
    document.getElementById('updatePortId').value = p.id;
    document.getElementById('updatePortName').value = p.name;
    document.getElementById('updatePortRole').value = p.role;
    document.getElementById('updatePortDesc').value = p.desc;
    document.getElementById('updatePortSkills').value = p.skillsText;
  }
}

function closeUpdatePortfolioModal() {
  document.getElementById('updatePortfolioModal').classList.remove('active');
}

function submitUpdatePortfolio(event) {
  event.preventDefault();
  const form = event.target;
  const btn = form.querySelector('button[type="submit"]');

  const id = document.getElementById('updatePortId').value;
  const name = document.getElementById('updatePortName').value;
  const role = document.getElementById('updatePortRole').value;
  const desc = document.getElementById('updatePortDesc').value;
  const skillsText = document.getElementById('updatePortSkills').value;

  btn.innerText = "Updating...";
  btn.disabled = true;

  fetch('api_update_portfolio.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, name, role, desc, skillsText })
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success') {
      const card = document.getElementById(`portfolio-${id}`);
      if (card) {
        card.remove();
      }
      renderCustomPortfolio({id, name, role, desc, skillsText});
      closeUpdatePortfolioModal();
      form.reset();
    } else {
      alert("Error updating portfolio: " + data.message);
    }
    btn.innerText = "Update Portfolio";
    btn.disabled = false;
  })
  .catch(err => {
    console.error(err);
    alert("Connection Error");
    btn.innerText = "Update Portfolio";
    btn.disabled = false;
  });
}

function openDeletePortfolioModal() {
  if (currentUser) {
    fetch('api_get_user_portfolios.php')
      .then(res => res.json())
      .then(data => {
        const select = document.getElementById('deletePortSelect');
        select.innerHTML = '';
        if (data.length === 0) {
          alert("You don't have any portfolios to delete.");
          return;
        }
        data.forEach(p => {
          const opt = document.createElement('option');
          opt.value = p.id;
          opt.innerText = p.name;
          select.appendChild(opt);
        });
        document.getElementById('deletePortfolioModal').classList.add('active');
      });
  } else {
    openAuthModal();
  }
}

function closeDeletePortfolioModal() {
  document.getElementById('deletePortfolioModal').classList.remove('active');
}

function submitDeletePortfolio(event) {
  event.preventDefault();
  const form = event.target;
  const btn = form.querySelector('button[type="submit"]');
  const id = document.getElementById('deletePortSelect').value;

  btn.innerText = "Deleting...";
  btn.disabled = true;

  fetch('api_delete_portfolio.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success') {
      const card = document.getElementById(`portfolio-${id}`);
      if (card) {
        card.remove();
      }
      closeDeletePortfolioModal();
      form.reset();
    } else {
      alert("Error deleting portfolio: " + data.message);
    }
    btn.innerText = "Delete Portfolio";
    btn.disabled = false;
  })
  .catch(err => {
    console.error(err);
    alert("Connection Error");
    btn.innerText = "Delete Portfolio";
    btn.disabled = false;
  });
}

function renderCustomPortfolio(portfolio) {
  const { id, name, role, desc, skillsText } = portfolio;

  // Prepare skills HTML
  const skills = skillsText.split(',').map(skill => skill.trim()).filter(skill => skill);
  let skillsHtml = '';
  skills.forEach(skill => {
    skillsHtml += `<span class="skill-badge">${skill}</span>`;
  });

  const initial = name ? name.charAt(0).toUpperCase() : 'U';
  
  let portfolioUrl = `template.html?name=${encodeURIComponent(name)}&role=${encodeURIComponent(role)}&desc=${encodeURIComponent(desc)}&skills=${encodeURIComponent(skillsText)}`;
  if (name.toLowerCase() === 'seham') {
    portfolioUrl = 'seham.html';
  } else if (name.toLowerCase() === 'amelia') {
    portfolioUrl = 'amelia.html';
  }
  
  // Custom classes for Seham and Amelia just to keep original UI colors if needed, optional
  let extraClass = '';
  if (name.toLowerCase() === 'seham') extraClass = 'seham';
  if (name.toLowerCase() === 'amelia') extraClass = 'amelia';

  // Build new card element
  const card = document.createElement('div');
  card.className = `glass-panel profile-card custom reveal active ${extraClass}`;
  card.id = `portfolio-${id}`;

  card.innerHTML = `
    <button class="delete-portfolio" onclick="deletePortfolio('${id}')" title="Delete Portfolio"><i class="fa-solid fa-trash"></i></button>
    <div class="profile-img-placeholder">${initial}</div>
    <h3>${name}</h3>
    <div class="profile-role">${role}</div>
    <p>${desc}</p>
    <div class="profile-skills">
      ${skillsHtml}
    </div>
    <a href="${portfolioUrl}" class="btn btn-outline" style="margin-top: 15px;">View Full Details</a>
  `;

  // Append to grid
  const grid = document.getElementById('profilesGrid');
  if (grid) {
    grid.appendChild(card);
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  // Remove deleted default portfolios from DOM
  deletedDefaults.forEach(id => {
    const card = document.getElementById(`portfolio-${id}`);
    if (card) {
      card.remove();
    }
  });

  // Fetch from Database
  fetch('api_get_portfolios.php')
    .then(response => response.json())
    .then(portfolios => {
      portfolios.forEach(p => {
        renderCustomPortfolio(p);
      });
    })
    .catch(err => {
      console.error("Could not fetch portfolios:", err);
    });

  // Check auth state
  checkAuth();
});

// Authentication Logic
let currentUser = null;
let currentAuthMode = 'login'; // or 'register'

function checkAuth() {
  fetch('api_check_auth.php')
    .then(res => res.json())
    .then(data => {
      const navBtn = document.getElementById('authNavBtn');
      if (data.status === 'loggedIn') {
        currentUser = data;
        navBtn.innerText = "Logout";
      } else {
        currentUser = null;
        navBtn.innerText = "Login / Register";
      }
    });
}

function handleAuthNavClick(event) {
  event.preventDefault();
  if (currentUser) {
    // Logout
    fetch('api_logout.php')
      .then(() => {
        currentUser = null;
        document.getElementById('authNavBtn').innerText = "Login / Register";
        alert("Logged out successfully.");
      });
  } else {
    openAuthModal();
  }
}

const authModal = document.getElementById('authModal');
function openAuthModal() {
  authModal.classList.add('active');
}

function closeAuthModal() {
  authModal.classList.remove('active');
}

function switchAuthTab(mode, event) {
  event?.preventDefault();
  currentAuthMode = mode;
  const loginBtn = document.getElementById('loginTabBtn');
  const registerBtn = document.getElementById('registerTabBtn');
  const submitBtn = document.getElementById('authSubmitBtn');
  const title = document.getElementById('authModalTitle');

  if (mode === 'login') {
    loginBtn.className = 'btn btn-primary';
    registerBtn.className = 'btn btn-outline';
    submitBtn.innerText = 'Sign In';
    title.innerText = 'Welcome Back';
  } else {
    loginBtn.className = 'btn btn-outline';
    registerBtn.className = 'btn btn-primary';
    submitBtn.innerText = 'Create Account';
    title.innerText = 'Register';
  }
}

function submitAuth(event) {
  event.preventDefault();
  const form = event.target;
  const btn = form.querySelector('button[type="submit"]');
  const email = document.getElementById('authEmail').value;
  const password = document.getElementById('authPassword').value;

  btn.innerText = "Processing...";
  btn.disabled = true;

  const endpoint = currentAuthMode === 'login' ? 'api_login.php' : 'api_register.php';

  fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === 'success') {
      checkAuth();
      closeAuthModal();
      form.reset();
      if (currentAuthMode === 'register') {
        alert("Account Created! You are now logged in.");
      } else {
        alert("Login successful!");
      }
    } else {
      alert("Error: " + data.message);
    }
    btn.disabled = false;
    btn.innerText = currentAuthMode === 'login' ? 'Sign In' : 'Create Account';
  })
  .catch(err => {
    console.error(err);
    alert("Connection Error");
    btn.disabled = false;
    btn.innerText = currentAuthMode === 'login' ? 'Sign In' : 'Create Account';
  });
}
