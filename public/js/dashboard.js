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
    const response = await fetch('/api/v1/courses');
    const data = await response.json();
    if (!response.ok) {
      setCrudMessage(data.error || 'Failed to fetch courses.', true);
      return [];
    }

    setCrudMessage(`Read success: ${data.courses?.length || 0} courses loaded.`);
    return data.courses || [];
  } catch (error) {
    setCrudMessage('Read failed: backend unavailable.', true);
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
    const response = await fetch('/api/v1/courses', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body)
    });
    const data = await response.json();
    if (!response.ok) {
      setCrudMessage(data.error || 'Create failed.', true);
      return;
    }

    setCrudMessage(`Create success: ${data.course?.title || 'course created'}.`);
  } catch (error) {
    setCrudMessage('Create failed: backend unavailable.', true);
  }
}

async function updateFirstCourse() {
  const courses = await readCourses();
  if (!courses.length) return;

  const first = courses[0];
  try {
    const response = await fetch(`/api/v1/courses/${first._id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ title: `${first.title} (Updated)` })
    });
    const data = await response.json();
    if (!response.ok) {
      setCrudMessage(data.error || 'Update failed.', true);
      return;
    }

    setCrudMessage(`Update success: ${data.course?.title || first.title}.`);
  } catch (error) {
    setCrudMessage('Update failed: backend unavailable.', true);
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
    const response = await fetch(`/api/v1/courses/${last._id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) {
      setCrudMessage(data.error || 'Delete failed.', true);
      return;
    }

    setCrudMessage(`Delete success: ${last.title}.`);
  } catch (error) {
    setCrudMessage('Delete failed: backend unavailable.', true);
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
