const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const categoryInput = document.getElementById("category-input");
const addBtn = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const darkToggle = document.getElementById("dark-toggle");
const warning = document.getElementById("warning-message");
const filterCategory = document.getElementById("filter-category");
const filterDate = document.getElementById("filter-date");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let darkMode = JSON.parse(localStorage.getItem("darkMode")) || false;

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function saveTheme() {
  localStorage.setItem("darkMode", JSON.stringify(darkMode));
}

function showWarning(message) {
  warning.textContent = message;
  warning.classList.remove("hidden");
  setTimeout(() => {
    warning.classList.add("hidden");
  }, 2500);
}

function renderTasks() {
  const selectedCategory = filterCategory.value;
  const selectedDate = filterDate.value;

  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const matchCategory = selectedCategory === "All" || task.category === selectedCategory;
    const matchDate = !selectedDate || task.date === selectedDate;

    if (!matchCategory || !matchDate) return;

    const li = document.createElement("li");
    if (task.done) li.classList.add("done");

    li.innerHTML = `
      <div class="task-details">
        <span>${task.text}</span>
        <small>${task.date} | ${task.category}</small>
      </div>
      <div class="actions">
        <input type="checkbox" ${task.done ? "checked" : ""} onchange="toggleDone(${index})"/>
        <button onclick="deleteTask(${index})">✕</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

function addTask() {
  const text = taskInput.value.trim();
  const date = dateInput.value;
  const category = categoryInput.value;

  if (!text) {
    showWarning("Please enter a task name.");
    return;
  }

  const today = new Date().toISOString().split("T")[0];
  if (date && date < today) {
    showWarning("Due date cannot be in the past.");
    return;
  }

  tasks.push({ text, date, category, done: false });
  saveTasks();
  renderTasks();

  taskInput.value = "";
  dateInput.value = "";
}

function toggleDone(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function toggleDarkMode() {
  darkMode = !darkMode;
  document.body.classList.toggle("dark", darkMode);
  darkToggle.textContent = darkMode ? "☀️" : "🌙";
  saveTheme();
}

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});
darkToggle.addEventListener("click", toggleDarkMode);
filterCategory.addEventListener("change", renderTasks);
filterDate.addEventListener("change", renderTasks);

if (darkMode) {
  document.body.classList.add("dark");
  darkToggle.textContent = "☀️";
}

Sortable.create(taskList, {
  animation: 150,
  onEnd: function (evt) {
    const movedItem = tasks.splice(evt.oldIndex, 1)[0];
    tasks.splice(evt.newIndex, 0, movedItem);
    saveTasks();
    renderTasks();
  },
});

function celebrate() {
    const confetti = require('canvas-confetti');
    confetti.create(document.body, {
      resize: true,
      useWorker: true
    })({ particleCount: 100, spread: 70 });
  }
  
  function toggleDone(index) {
    tasks[index].done = !tasks[index].done;
    saveTasks();
    renderTasks();
  
    if (tasks[index].done) celebrate();  // Trigger confetti when the task is marked as done
  }
  
renderTasks();
