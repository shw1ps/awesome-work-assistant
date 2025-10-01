alert("данный сайт находится в разработке, но пока вы можете ознакомится с функционалом")
const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');

let tasks = [];

function render() {
  list.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';
    li.innerHTML = `
      <span>${task.text}</span>
      <div>
        <button onclick="toggle(${index})">✔</button><button onclick="remove(${index})">✖</button>
      </div>
    `;
    list.appendChild(li);
  });
}

function toggle(index) {
  tasks[index].completed = !tasks[index].completed;
  render();
}

function remove(index) {
  tasks.splice(index, 1);
  render();
}

form.addEventListener('submit', e => {
  e.preventDefault();
  tasks.push({ text: input.value, completed: false });
  input.value = '';
  render();
});

render();


// заметки
   const notesList = document.getElementById("notes-list");
    const addNoteBtn = document.getElementById("add-note");
    const textarea = document.getElementById("note");
    const noteTitle = document.getElementById("note-title");

    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    let currentIndex = 0;

    function saveNotes() {
      localStorage.setItem("notes", JSON.stringify(notes));
    }

    function renderNotes() {
      notesList.innerHTML = "";
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

    function deleteNote(index) {
      notes.splice(index, 1);
      if (currentIndex >= notes.length) currentIndex = notes.
length - 1;
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