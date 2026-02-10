function getApiBaseUrl() {
  const metaValue = document.querySelector('meta[name="api-base-url"]')?.content?.trim();
  const localValue = localStorage.getItem('apiBaseUrl')?.trim();
  if (metaValue) return metaValue;
  if (localValue) return localValue;

  const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
  if (isLocalhost && window.location.port !== '3005') {
    return `http://${window.location.hostname}:3005`;
  }

  return '';
}

function withApiBase(path) {
  return `${getApiBaseUrl()}${path}`;
}

async function parseApiResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();
  return { error: text || `HTTP ${response.status}` };
}

const enrolledCourses = [
  { title: 'The Complete Full-Stack Web Bootcamp', instructor: 'Angela M.', progress: 62 },
  { title: 'Practical Prompt Engineering', instructor: 'Sophia W.', progress: 35 },
  { title: 'UI/UX Design from Scratch', instructor: 'Nina R.', progress: 84 },
  { title: 'Business Analytics Fundamentals', instructor: 'Chris T.', progress: 48 }
];

const enrolledGrid = document.getElementById('enrolledGrid');
const crudMessage = document.getElementById('crudMessage');

function setCrudMessage(message, isError = false) {
  crudMessage.textContent = message;
  crudMessage.classList.toggle('error', isError);
}

function getAuthHeaders() {
  const token = localStorage.getItem('authToken');
  if (!token) return { 'Content-Type': 'application/json' };
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
}

async function readCourses() {
  try {
    const response = await fetch(withApiBase('/api/v1/courses'));
    const data = await parseApiResponse(response);
    if (!response.ok) {
      setCrudMessage(data.error || `Failed to fetch courses (status ${response.status}).`, true);
      return [];
    }

    setCrudMessage(`Read success: ${data.courses?.length || 0} courses loaded.`);
    return data.courses || [];
  } catch (error) {
    setCrudMessage(`Read failed: backend unavailable${getApiBaseUrl() ? ` at ${getApiBaseUrl()}` : ''}.`, true);
    return [];
  }
}

async function createCourse() {
  const body = {
    title: `New Course ${Date.now()}`,
    description: 'Created from dashboard CRUD panel',
    price: 49,
    category: 'Web Development',
    difficulty: 'beginner',
    tags: ['frontend', 'test']
  };

  try {
    const response = await fetch(withApiBase('/api/v1/courses'), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body)
    });
    const data = await parseApiResponse(response);
    if (!response.ok) {
      setCrudMessage(data.error || `Create failed (status ${response.status}).`, true);
      return;
    }

    setCrudMessage(`Create success: ${data.course?.title || 'course created'}.`);
  } catch (error) {
    setCrudMessage(`Create failed: backend unavailable${getApiBaseUrl() ? ` at ${getApiBaseUrl()}` : ''}.`, true);
  }
}

async function updateFirstCourse() {
  const courses = await readCourses();
  if (!courses.length) return;

  const first = courses[0];
  try {
    const response = await fetch(withApiBase(`/api/v1/courses/${first._id}`), {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ title: `${first.title} (Updated)` })
    });
    const data = await parseApiResponse(response);
    if (!response.ok) {
      setCrudMessage(data.error || `Update failed (status ${response.status}).`, true);
      return;
    }

    setCrudMessage(`Update success: ${data.course?.title || first.title}.`);
  } catch (error) {
    setCrudMessage(`Update failed: backend unavailable${getApiBaseUrl() ? ` at ${getApiBaseUrl()}` : ''}.`, true);
  }
}

async function deleteLastCourse() {
  const courses = await readCourses();
  if (!courses.length) {
    setCrudMessage('Delete skipped: no courses available.', true);
    return;
  }

  const last = courses[courses.length - 1];
  try {
    const response = await fetch(withApiBase(`/api/v1/courses/${last._id}`), {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await parseApiResponse(response);
    if (!response.ok) {
      setCrudMessage(data.error || `Delete failed (status ${response.status}).`, true);
      return;
    }

    setCrudMessage(`Delete success: ${last.title}.`);
  } catch (error) {
    setCrudMessage(`Delete failed: backend unavailable${getApiBaseUrl() ? ` at ${getApiBaseUrl()}` : ''}.`, true);
  }
}

function renderEnrolledCard(course) {
  return `
    <article class="enrolled-card">
      <h3>${course.title}</h3>
      <p class="instructor">Instructor: ${course.instructor}</p>
      <div class="progress-wrap">
        <div class="progress-bar" style="width: ${course.progress}%"></div>
      </div>
      <p class="progress-label">${course.progress}% complete</p>
      <button class="continue-btn">Continue Learning</button>
    </article>
  `;
}

document.getElementById('createCourseBtn').addEventListener('click', createCourse);
document.getElementById('readCoursesBtn').addEventListener('click', readCourses);
document.getElementById('updateCourseBtn').addEventListener('click', updateFirstCourse);
document.getElementById('deleteCourseBtn').addEventListener('click', deleteLastCourse);

enrolledGrid.innerHTML = enrolledCourses.map(renderEnrolledCard).join('');
