const API = "http://localhost:5000/api";

document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  drawChart();

  const modal = new bootstrap.Modal(document.getElementById("taskModal"));
  const form = document.getElementById("modalTaskForm");
  const deleteBtn = document.getElementById("deleteTaskBtn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const taskId = document.getElementById("taskId").value;
    const task = {
      title: document.getElementById("title").value,
      due_date: document.getElementById("due_date").value,
      priority: document.getElementById("priority").value,
      description: document.getElementById("description").value,
    };

    const method = taskId ? "PUT" : "POST";
    const url = taskId ? `${API}/tasks/${taskId}` : `${API}/tasks`;

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify(task),
    });

    if (res.ok) {
      modal.hide();
      await loadTasks();
    } else {
      alert("Error saving task");
    }
  });

  deleteBtn.addEventListener("click", async () => {
    const taskId = document.getElementById("taskId").value;
    if (!taskId) return;

    if (!confirm("Delete this task?")) return;

    const res = await fetch(`${API}/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    });

    if (res.ok) {
      modal.hide();
      await loadTasks();
    } else {
      alert("Error deleting task");
    }
  });
});

async function loadTasks() {
  const res = await fetch(`${API}/tasks`, {
    headers: {
      "x-auth-token": localStorage.getItem("token"),
    },
  });
  const tasks = await res.json();
  renderCalendar(tasks);
  drawChart(tasks);
}

function drawChart(tasks = []) {
  const statusCounts = { pending: 0, completed: 0 };
  tasks.forEach(t => statusCounts[t.status || "pending"]++);

  const ctx = document.getElementById("taskChart").getContext("2d");
  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Pending", "Completed"],
      datasets: [{
        data: [statusCounts.pending, statusCounts.completed],
        backgroundColor: ["#ffc107", "#28a745"],
      }],
    },
    options: { responsive: true }
  });
}

function clearTaskModal() {
  document.getElementById("modalTaskForm").reset();
  document.getElementById("taskId").value = "";
  document.getElementById("deleteTaskBtn").style.display = "none";
}

function showModal(isEdit = false) {
  const deleteBtn = document.getElementById("deleteTaskBtn");
  deleteBtn.style.display = isEdit ? "inline-block" : "none";
  const modal = new bootstrap.Modal(document.getElementById("taskModal"));
  modal.show();
}
