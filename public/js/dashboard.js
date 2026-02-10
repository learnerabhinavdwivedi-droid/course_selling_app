const enrolledCourses = [
  { title: 'The Complete Full-Stack Web Bootcamp', instructor: 'Angela M.', progress: 62 },
  { title: 'Practical Prompt Engineering', instructor: 'Sophia W.', progress: 35 },
  { title: 'UI/UX Design from Scratch', instructor: 'Nina R.', progress: 84 },
  { title: 'Business Analytics Fundamentals', instructor: 'Chris T.', progress: 48 }
];

const enrolledGrid = document.getElementById('enrolledGrid');

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

enrolledGrid.innerHTML = enrolledCourses.map(renderEnrolledCard).join('');
