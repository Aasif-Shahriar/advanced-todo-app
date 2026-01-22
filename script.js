// DOM ELEMENTS
const taskList = document.querySelector("ul");
const addTaskBtn = document.getElementById("add-task");
const addTaskPanel = document.querySelector(".add-task-panel");
const taskInput = document.getElementById("task-input");
const confirmTaskBtn = document.getElementById("confirm-task");
const cancelTaskBtn = document.getElementById("cancel-task");
const filterButtons = document.querySelectorAll("nav.filters button");
const darkModeToggle = document.getElementById("dark-mode-toggle");

// STATE
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// INIT
renderTask();
updateCounts();

// ADD TASK PANEL LOGIC
addTaskBtn.addEventListener("click", () => {
  addTaskPanel.classList.remove("hidden");
  taskInput.focus();
});

taskInput.addEventListener("input", () => {
  confirmTaskBtn.disabled = taskInput.value.trim() === "";
});

confirmTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();

  if (!text) return;

  tasks.push({
    id: Date.now(),
    text,
    completed: false,
  });

  resetAddPanel();
  saveAndRender();
});

cancelTaskBtn.addEventListener("click", resetAddPanel);

function resetAddPanel() {
  taskInput.value = "";
  confirmTaskBtn.disabled = true;
  addTaskPanel.classList.add("hidden");
}

//TASK ACTIONS (DELEGATION)
taskList.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li) return;

  const id = Number(li.dataset.id);

  if (
    e.target.classList.contains("fa-circle") ||
    e.target.classList.contains("fa-circle-check")
  ) {
    toggleTask(id);
  }

  if (e.target.classList.contains("delete")) {
    deleteTask(id);
  }

  if (e.target.classList.contains("edit")) {
    renameTask(id);
  }
});

//FILTERS
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-active")?.classList.remove("filter-active");
    btn.classList.add("filter-active");
    currentFilter = btn.dataset.filter;
    renderTask();
  });
});

// DARK MODE
// ==========================
darkModeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem(
    "darkMode",
    document.body.classList.contains("dark-mode"),
  );
});

function restoreDarkMode() {
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
    darkModeToggle.checked = true;
  }
}

// CORE FUNCTION
function renderTask() {
  taskList.innerHTML = "";

  let filtered = tasks;
  if (currentFilter === "active") {
    filtered = tasks.filter((t) => !t.completed);
  } else if (currentFilter === "completed") {
    filtered = tasks.filter((t) => t.completed);
  }

  filtered.forEach((task) => {
    const li = document.createElement("li");
    li.dataset.id = task.id;
    li.classList.toggle("completed", task.completed);

    li.innerHTML = `
    <div class='task-left'>
    <i class="fa-regular ${task.completed ? "fa-circle-check" : "fa-check"}"></i>
    <span>${task.text}</span>
    </div>
    <div class="task-actions">
    <i class="fa-solid fa-pen edit"></i>
    <i class="fa-solid fa-trash delete"></i>
    </div>
    `;
    taskList.appendChild(li);
  });
}

function toggleTask(id) {
  tasks = tasks.map((t) => {
    t.id === id ? { ...t, completed: !t.completed } : t;
  });
  saveAndRender();
}
function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveAndRender();
}

function saveAndRender() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTask();
}
function renameTask(id) {
  const task = tasks.find((t) => t.id === id);
  const newText = prompt("Rename task", task.text);

  if (!newText || newText.trim() === "") {
    task.text = newText.trim();
    saveAndRender();
  }
}

function updateCounts() {
  document.querySelector('[data-filter="all"] .count').textContent =
    tasks.length;
  document.querySelector('[data-filter="active"] .count').textContent =
    tasks.length;
  document.querySelector('[data-filter="completed"] .count').textContent =
    tasks.length;
}
