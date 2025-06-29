const people = JSON.parse(localStorage.getItem('people') || '[]');
const meetings = JSON.parse(localStorage.getItem('meetings') || '[]');
const actions = JSON.parse(localStorage.getItem('actions') || '[]');

function save() {
  localStorage.setItem('people', JSON.stringify(people));
  localStorage.setItem('meetings', JSON.stringify(meetings));
  localStorage.setItem('actions', JSON.stringify(actions));
}

function addPerson() {
  const name = document.getElementById('personName');
  const notes = document.getElementById('personNotes');
  people.push({ id: Date.now(), name: name.value, notes: notes.value });
  save();
  renderAssignOptions();
  showMessage('personMessage', 'Person added!');
  name.value = '';
  notes.value = '';
}

function addMeeting() {
  const title = document.getElementById('meetingTitle');
  const date = document.getElementById('meetingDate');
  meetings.push({ id: Date.now(), title: title.value, date: date.value });
  save();
  renderAssignOptions();
  showMessage('meetingMessage', 'Meeting added!');
  title.value = '';
  date.value = '';
}

function addActionItem() {
  const desc = document.getElementById('actionDesc');
  const date = document.getElementById('actionDate');
  const assignVal = document.getElementById('actionAssignTo');
  const [type, id] = assignVal.value.split(':');
  actions.push({
    id: Date.now(),
    text: desc.value,
    due: date.value,
    completed: false,
    assignedToType: type,
    assignedToId: Number(id),
  });
  save();
  renderDashboard();
  showMessage('actionMessage', 'Action item added!');
  desc.value = '';
  date.value = '';
  assignVal.selectedIndex = 0;
}

function toggleComplete(id) {
  actions.forEach((a) => {
    if (a.id === id) a.completed = !a.completed;
  });
  save();
  renderDashboard();
}

function renderAssignOptions() {
  const sel = document.getElementById('actionAssignTo');
  sel.innerHTML = '';
  people.forEach((p) => {
    sel.innerHTML += `<option value="person:${p.id}">Person: ${p.name}</option>`;
  });
  meetings.forEach((m) => {
    sel.innerHTML += `<option value="meeting:${m.id}">Meeting: ${m.title}</option>`;
  });
}

function renderDashboard() {
  const dash = document.getElementById('dashboard');
  dash.innerHTML = '';

  const hideCompleted = document.getElementById('hideCompletedToggle')?.checked;

  const sorted = actions
    .slice()
    .filter((a) => !hideCompleted || !a.completed)
    .sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return new Date(a.due) - new Date(b.due);
    });

  sorted.forEach((a) => {
    let assignedLabel = '';
    if (a.assignedToType === 'person') {
      const person = people.find((p) => p.id === a.assignedToId);
      assignedLabel = person ? `Person: ${person.name}` : 'Unknown person';
    } else {
      const meeting = meetings.find((m) => m.id === a.assignedToId);
      assignedLabel = meeting ? `Meeting: ${meeting.title}` : 'Unknown meeting';
    }

    const label = `${a.text} (Due: ${a.due}) — ${assignedLabel}`;

    dash.innerHTML += `<div class="action-item ${a.completed ? 'completed' : ''}">
 <input type="checkbox" onchange="toggleComplete(${a.id})" ${
   a.completed ? 'checked' : ''
 } /> ${label}
    </div>`;
  });
}

function showMessage(id, text) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.style.display = 'block';
  setTimeout(() => {
    el.style.display = 'none';
  }, 1000);
}

function toggleDarkMode() {
  const isDark = document.getElementById('darkModeToggle').checked;
  document.body.classList.toggle('dark-mode', isDark);
  localStorage.setItem('darkMode', isDark ? 'true' : 'false');
}

window.onload = function () {
  renderAssignOptions();
  renderDashboard();
  const darkPref = localStorage.getItem('darkMode') === 'true';
  document.getElementById('darkModeToggle').checked = darkPref;
  document.body.classList.toggle('dark-mode', darkPref);
};

window.addPerson = addPerson;
window.addMeeting = addMeeting;
window.addActionItem = addActionItem;
window.toggleComplete = toggleComplete;
window.toggleDarkMode = toggleDarkMode;
