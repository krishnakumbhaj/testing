const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("tasks");
const emptyListMessage = document.getElementById("empty-list");

let tasks = [];

// Helper function to get the current time in "HH:MM" format
function getCurrentTime() {
  const now = new Date();
  return now.toTimeString().slice(0, 5);
}

// Load tasks from Local Storage
window.addEventListener("load", () => {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    renderTasks();
  }
});

// Add a task
taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const taskName = document.getElementById("task-name").value;
  const startTime = document.getElementById("start-time").value;
  const endTime = document.getElementById("end-time").value;

  // Validation: End time must be after start time
  if (startTime >= endTime) {
    alert("End time must be later than start time!");
    return;
  }

  // Validation: No overlapping tasks
  if (isOverlapping(startTime, endTime)) {
    alert("This time slot is already occupied by another task!");
    return;
  }

  const task = {
    id: Date.now(),
    name: taskName,
    start: startTime,
    end: endTime,
    completed: false, // Newly added task is not completed by default
  };

  tasks.push(task);
  saveTasks();
  renderTasks();
  taskForm.reset();
});

// Check for overlapping tasks
function isOverlapping(newStart, newEnd) {
  return tasks.some(task => {
    const existingStart = task.start;
    const existingEnd = task.end;
    return (
      (newStart >= existingStart && newStart < existingEnd) ||
      (newEnd > existingStart && newEnd <= existingEnd) ||
      (newStart <= existingStart && newEnd >= existingEnd)
    );
  });
}

// Render tasks
function renderTasks() {
  taskList.innerHTML = "";
  const currentTime = getCurrentTime();

  if (tasks.length === 0) {
    emptyListMessage.style.display = "block";
  } else {
    emptyListMessage.style.display = "none";

    // Separate tasks by status: Completed, Running, and Upcoming
    const currentTask = tasks.find(task => currentTime >= task.start && currentTime < task.end && !task.completed);
    const completedTasks = tasks.filter(task => task.completed).sort((a, b) => a.start.localeCompare(b.start));
    const upcomingTasks = tasks.filter(task => !task.completed && task !== currentTask).sort((a, b) => a.start.localeCompare(b.start));

    // Display the current task (highlighted in blue or running color)
    if (currentTask) {
      const currentLi = document.createElement("li");
      currentLi.className =
        "bg-blue-700 p-4 shadow-md rounded-3xl flex justify-between items-center text-white"; // Highlight in blue (Running task)

      currentLi.innerHTML = `
        <div>
          <span class="block text-white font-bold text-lg">${currentTask.name}</span>
          <span class="block text-white text-sm">(${currentTask.start} - ${currentTask.end})</span>
        </div>
        <div class="flex space-x-4">
          <i class="fas fa-check text-green-500 text-xl cursor-pointer hover:text-green-600" onclick="completeTask(${currentTask.id})" title="Complete Task"></i>
          <i class="fas fa-trash text-white text-xl cursor-pointer hover:text-red-600" onclick="deleteTask(${currentTask.id})" title="Delete Task"></i>
        </div>
      `;
      taskList.appendChild(currentLi);
    }

    // Display completed tasks (highlighted in green)
   // Display completed tasks (highlighted in green)
completedTasks.forEach(task => {
            const completedLi = document.createElement("li");
            completedLi.className =
              "bg-green-500 p-4 shadow-md rounded-3xl flex justify-between items-center text-white"; // Highlight in green (Completed task)
          
            completedLi.innerHTML = `
              <div>
                <span class="block text-white font-bold text-lg">${task.name}</span>
                <span class="block text-white text-sm">(${task.start} - ${task.end})</span>
              </div>
              <div class="flex space-x-4">
                <i class="fas fa-trash text-white text-xl cursor-pointer hover:text-red-600" onclick="deleteTask(${task.id})" title="Delete Task"></i>
              </div>
            `;
            taskList.appendChild(completedLi);
          });
          

    // Display upcoming tasks (normal tasks)
    upcomingTasks.forEach(task => {
      const li = document.createElement("li");
      li.className =
        "bg-gray-100 p-4 shadow-md rounded-3xl flex justify-between items-center";

      li.innerHTML = `
        <div>
          <span class="block text-blue-700 font-bold text-lg">${task.name}</span>
          <span class="block text-blue-700 text-sm">(${task.start} - ${task.end})</span>
        </div>
        <div class="flex space-x-4">
          <i class="fas fa-trash text-red-500 text-xl cursor-pointer hover:text-red-600" onclick="deleteTask(${task.id})" title="Delete Task"></i>
        </div>
      `;
      taskList.appendChild(li);
    });
  }
}

// Save tasks to Local Storage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Delete a task
function deleteTask(taskId) {
  tasks = tasks.filter(task => task.id !== taskId);
  saveTasks();
  renderTasks();
}

// Complete a task (mark as completed)
function completeTask(taskId) {
  const task = tasks.find(task => task.id === taskId);
  if (task) {
    task.completed = true; // Mark task as completed
    saveTasks();
    renderTasks();
  }
}

// Edit a task (if needed)
function editTask(taskId) {
  const task = tasks.find(task => task.id === taskId);

  if (task) {
    document.getElementById("task-name").value = task.name;
    document.getElementById("start-time").value = task.start;
    document.getElementById("end-time").value = task.end;

    deleteTask(taskId);
  }
}
