const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const searchInput = document.getElementById('task-search');
const filterSelect = document.getElementById('task-filter');
const toggleAllBtn = document.getElementById('toggle-all');
const clearCompletedBtn = document.getElementById('clear-completed');
const resetListBtn = document.getElementById('reset-list');
const summaryBox = document.getElementById('task-summary');

const TASKS_KEY = 'awa_tasks_v1';
const FILTER_KEY = 'awa_filter';
const SEARCH_KEY = 'awa_search';

let tasks = JSON.parse(localStorage.getItem(TASKS_KEY)) || [];
let currentFilter = localStorage.getItem(FILTER_KEY) || 'all';
let searchQuery = localStorage.getItem(SEARCH_KEY) || '';

function saveTasks() {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

function updateSummary() {
  const total = tasks.length;
  const done = tasks.filter(t => t.completed).length;
  const important = tasks.filter(t => t.important).length;
  const active = total - done;
  summaryBox.textContent = `Всего: ${total} • В работе: ${active} • Выполнено: ${done} • Важно: ${important}`;
}

function render() {
  list.innerHTML = '';

  const filtered = tasks
    .map((task, index) => ({ task, index }))
    .filter(({ task }) => {
      const matchesSearch = task.text.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
      if (currentFilter === 'active') return !task.completed;
      if (currentFilter === 'completed') return task.completed;
      if (currentFilter === 'important') return task.important;
      return true;
    });

  filtered.forEach(({ task, index }) => {
    const li = document.createElement('li');
    li.className = `${task.completed ? 'completed' : ''} ${task.important ? 'important' : ''}`;

    const main = document.createElement('div');
    main.className = 'task-main';

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = task.completed ? '↺' : '✔';
    toggleBtn.title = 'Готово / вернуть в работу';
    toggleBtn.onclick = () => toggle(index);

    const importantBtn = document.createElement('button');
    importantBtn.textContent = task.important ? '★' : '☆';
    importantBtn.title = 'Важное';
    importantBtn.onclick = () => toggleImportant(index);

    const textSpan = document.createElement('span');
    textSpan.className = 'task-text';
    textSpan.textContent = task.text;
    textSpan.title = 'Двойной клик чтобы отредактировать';
    textSpan.ondblclick = () => editTask(index);

    main.appendChild(toggleBtn);
    main.appendChild(importantBtn);
    main.appendChild(textSpan);

    const actions = document.createElement('div');

    const editBtn = document.createElement('button');
    editBtn.textContent = '✎';
    editBtn.title = 'Редактировать';
    editBtn.onclick = () => editTask(index);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '✖';
    deleteBtn.title = 'Удалить';
    deleteBtn.onclick = () => remove(index);

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(main);
    li.appendChild(actions);
    list.appendChild(li);
  });

  updateSummary();
}

function toggle(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  render();
}

function toggleImportant(index) {
  tasks[index].important = !tasks[index].important;
  saveTasks();
  render();
}

function remove(index) {
  tasks.splice(index, 1);
  saveTasks();
  render();
}

function editTask(index) {
  const next = prompt('Изменить задачу:', tasks[index].text);
  if (next === null) return;
  const trimmed = next.trim();
  if (!trimmed) return;
  tasks[index].text = trimmed;
  saveTasks();
  render();
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const value = input.value.trim();
  if (!value) return;
  tasks.push({ text: value, completed: false, important: false, created: Date.now() });
  input.value = '';
  saveTasks();
  render();
});

searchInput.value = searchQuery;
searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value;
  localStorage.setItem(SEARCH_KEY, searchQuery);
  render();
});

filterSelect.value = currentFilter;
filterSelect.addEventListener('change', (e) => {
  currentFilter = e.target.value;
  localStorage.setItem(FILTER_KEY, currentFilter);
  render();
});

toggleAllBtn.addEventListener('click', () => {
  const allCompleted = tasks.length > 0 && tasks.every(t => t.completed);
  tasks = tasks.map(t => ({ ...t, completed: !allCompleted }));
  saveTasks();
  render();
});

clearCompletedBtn.addEventListener('click', () => {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  render();
});

resetListBtn.addEventListener('click', () => {
  if (!confirm('Полностью очистить список задач?')) return;
  tasks = [];
  saveTasks();
  render();
});

render();


// заметки
   const notesList = document.getElementById("notes-list");
    const addNoteBtn = document.getElementById("add-note");
    const textarea = document.getElementById("note");
    const noteTitle = document.getElementById("note-title");
    const notesSelect = document.getElementById("notes-select");

    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    let currentIndex = 0;

    function saveNotes() {
      localStorage.setItem("notes", JSON.stringify(notes));
    }

    function renderNotes() {
      notesList.innerHTML = "";
      notesSelect.innerHTML = "";
      notes.forEach((note, index) => {
        const div = document.createElement("div");
        div.className = "note-item";
        if (index === currentIndex) div.classList.add("active");

        const titleSpan = document.createElement("span");
        titleSpan.textContent = note.title || "Без названия";
        titleSpan.style.flex = "1";
        titleSpan.onclick = () => {
          currentIndex = index;
          loadNote();
        };

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "✖";
        deleteBtn.onclick = (e) => {
          e.stopPropagation(); // чтобы не открывалась заметка при клике на крестик
          deleteNote(index);
        };

        div.appendChild(titleSpan);
        div.appendChild(deleteBtn);
        notesList.appendChild(div);

        const option = document.createElement("option");
        option.value = index;
        option.textContent = note.title || "Без названия";
        if (index === currentIndex) option.selected = true;
        notesSelect.appendChild(option);
      });
    }

    function loadNote() {
  const note = notes[currentIndex];
  noteTitle.textContent = note.content ? note.content.split('\n')[0] : "Без названия";
  textarea.value = note.content;
  renderNotes();
}
    textarea.addEventListener("input", () => {
  notes[currentIndex].content = textarea.value;
  notes[currentIndex].title = textarea.value ? textarea.value.split('\n')[0] : "Без названия";
  saveNotes();
  renderNotes();
});

    addNoteBtn.addEventListener("click", () => {
      notes.push({ title: "Новая заметка", content: "" });
      currentIndex = notes.length - 1;
      saveNotes();
      loadNote();
    });

    notesSelect.addEventListener("change", (e) => {
      const idx = parseInt(e.target.value, 10);
      if (!Number.isNaN(idx)) {
        currentIndex = idx;
        loadNote();
      }
    });

    function deleteNote(index) {
      notes.splice(index, 1);
      if (currentIndex >= notes.length) currentIndex = notes.length - 1;
      if (notes.length === 0) {
        notes.push({ title: "Новая заметка", content: "" });
        currentIndex = 0;
      }
      saveNotes();
      loadNote();
    }

    if (notes.length === 0) {
      notes.push({ title: "Первая заметка", content: "" });
    }
    loadNote();