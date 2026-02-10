const courses = [
  {
    title: 'The Complete Full-Stack Web Bootcamp',
    instructor: 'Angela M.',
    rating: 4.8,
    price: 89.99,
    category: 'Web Development',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Data Science & ML Masterclass',
    instructor: 'Jose P.',
    rating: 4.7,
    price: 99.99,
    category: 'Data Science',
    thumbnail: 'https://images.unsplash.com/photo-1551281044-8d8d7f4fbb63?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'UI/UX Design from Scratch',
    instructor: 'Nina R.',
    rating: 4.5,
    price: 59.99,
    category: 'Design',
    thumbnail: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Business Analytics Fundamentals',
    instructor: 'Chris T.',
    rating: 4.2,
    price: 49.99,
    category: 'Business',
    thumbnail: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'React + TypeScript Advanced Patterns',
    instructor: 'Liam K.',
    rating: 4.9,
    price: 109.99,
    category: 'Web Development',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Practical Prompt Engineering',
    instructor: 'Sophia W.',
    rating: 4.6,
    price: 79.99,
    category: 'Data Science',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80'
  }
];

const courseGrid = document.getElementById('courseGrid');
const maxPrice = document.getElementById('maxPrice');
const priceLabel = document.getElementById('priceLabel');
const categoryFilters = Array.from(document.querySelectorAll('.category-filter'));
const ratingFilters = Array.from(document.querySelectorAll('input[name="rating"]'));
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const courseSearch = document.getElementById('courseSearch');

const authForm = document.getElementById('authForm');
const authTitle = document.getElementById('authTitle');
const authSubmit = document.getElementById('authSubmit');
const authMessage = document.getElementById('authMessage');
const switchLogin = document.getElementById('switchLogin');
const switchSignup = document.getElementById('switchSignup');
const roleInput = document.getElementById('roleInput');
const nameInput = document.getElementById('nameInput');

let authMode = 'signup';

function setAuthMessage(text, isError = false) {
  authMessage.textContent = text;
  authMessage.classList.toggle('error', isError);
}

function setAuthMode(mode) {
  authMode = mode;
  const isSignup = mode === 'signup';
  authTitle.textContent = isSignup ? 'Create account' : 'Log in';
  authSubmit.textContent = isSignup ? 'Sign up' : 'Log in';
  nameInput.style.display = isSignup ? 'block' : 'none';
  roleInput.style.display = isSignup ? 'block' : 'none';
  nameInput.required = isSignup;
  setAuthMessage('');
}

async function submitAuth(event) {
  event.preventDefault();

  const email = document.getElementById('emailInput').value.trim();
  const password = document.getElementById('passwordInput').value.trim();
  const name = nameInput.value.trim();
  const role = roleInput.value;

  if (!email || !password) {
    setAuthMessage('Email and password are required.', true);
    return;
  }


  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setAuthMessage('Please enter a valid email address.', true);
    return;
  }
  if (password.length < 6) {
    setAuthMessage('Password must be at least 6 characters long.', true);
    return;
  }

  if (authMode === 'signup' && !name) {
    setAuthMessage('Please enter your full name for signup.', true);
    return;
  }

  const endpoint = authMode === 'signup' ? '/api/v1/auth/signup' : '/api/v1/auth/login';
  const payload = authMode === 'signup' ? { name, email, password, role } : { email, password };

  try {
    const API_BASE_URL = window.location.origin;
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      setAuthMessage(data.error || 'Request failed. Please try again.', true);
      return;
    }

    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('authRole', data.user?.role || role || 'student');
    }

    setAuthMessage(`${authMode === 'signup' ? 'Signup' : 'Login'} successful. Token saved for API tests.`);
  } catch (error) {
    setAuthMessage('Unable to reach backend API. Is the server running on port 3005?', true);
  }
}

function stars(rating) {
  const rounded = Math.round(rating);
  return '★'.repeat(rounded) + '☆'.repeat(5 - rounded);
}

function renderCourseCard(course) {
  return `
    <article class="course-card">
      <img src="${course.thumbnail}" alt="${course.title}" />
      <div class="course-card-content">
        <h3 class="course-title">${course.title}</h3>
        <p class="instructor">${course.instructor}</p>
        <p class="rating"><span class="rating-stars">${stars(course.rating)}</span> ${course.rating.toFixed(1)}</p>
        <p class="price">$${course.price.toFixed(2)}</p>
      </div>
    </article>
  `;
}

function applyFilters() {
  const selectedCategories = categoryFilters.filter((el) => el.checked).map((el) => el.value);
  const selectedRatingInput = ratingFilters.find((el) => el.checked);
  const minRating = selectedRatingInput ? Number(selectedRatingInput.value) : 0;
  const selectedMaxPrice = Number(maxPrice.value);
  const searchQuery = courseSearch.value.trim().toLowerCase();

  const filtered = courses.filter((course) => {
    const matchesCategory = selectedCategories.length ? selectedCategories.includes(course.category) : true;
    const matchesRating = course.rating >= minRating;
    const matchesPrice = course.price <= selectedMaxPrice;
    const matchesSearch = !searchQuery
      || course.title.toLowerCase().includes(searchQuery)
      || course.instructor.toLowerCase().includes(searchQuery);

    return matchesCategory && matchesRating && matchesPrice && matchesSearch;
  });

  courseGrid.innerHTML = filtered.map(renderCourseCard).join('');

  if (!filtered.length) {
    courseGrid.innerHTML = '<p>No courses match your filters. Try adjusting your selection.</p>';
  }
}

maxPrice.addEventListener('input', () => {
  priceLabel.textContent = `$${maxPrice.value}`;
  applyFilters();
});

courseSearch.addEventListener('input', applyFilters);
categoryFilters.forEach((input) => input.addEventListener('change', applyFilters));
ratingFilters.forEach((input) => input.addEventListener('change', applyFilters));

menuToggle.addEventListener('click', () => {
  navMenu.classList.toggle('open');
});

switchLogin.addEventListener('click', () => setAuthMode('login'));
switchSignup.addEventListener('click', () => setAuthMode('signup'));
authForm.addEventListener('submit', submitAuth);

setAuthMode('signup');
applyFilters();
