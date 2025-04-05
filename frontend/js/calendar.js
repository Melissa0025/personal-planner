document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    const modal = new bootstrap.Modal(document.getElementById('taskModal'));
    const taskForm = document.getElementById('taskForm');
    const deleteTaskBtn = document.getElementById('deleteTaskBtn');

    let selectedDate = null;

    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        selectable: true,
        editable: false,
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        dateClick: function (info) {
            resetForm();
            selectedDate = info.dateStr;
            document.getElementById('due_date').value = selectedDate;
            deleteTaskBtn.style.display = 'none';
            modal.show();
        },
        eventClick: function (info) {
            const task = info.event.extendedProps;
            document.getElementById('taskId').value = info.event.id;
            document.getElementById('title').value = info.event.title;
            document.getElementById('due_date').value = info.event.startStr;
            document.getElementById('priority').value = task.priority;
            document.getElementById('status').value = task.status;
            document.getElementById('description').value = task.description;
            deleteTaskBtn.style.display = 'inline-block';
            modal.show();
        },
        events: fetchTasks,
        eventDidMount: function (info) {
            const priority = info.event.extendedProps.priority;
            const el = info.el;

            // Apply color based on priority
            switch (priority) {
                case 'High':
                    el.style.backgroundColor = '#dc3545'; // red
                    el.style.borderColor = '#dc3545';
                    break;
                case 'Medium':
                    el.style.backgroundColor = '#ffc107'; // yellow
                    el.style.borderColor = '#ffc107';
                    el.style.color = 'black';
                    break;
                case 'Low':
                    el.style.backgroundColor = '#198754'; // green
                    el.style.borderColor = '#198754';
                    break;
            }
        }
    });

    calendar.render();

    function fetchTasks(fetchInfo, successCallback, failureCallback) {
        fetch('http://localhost:5000/tasks', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            const events = data.map(task => ({
                id: task.id,
                title: task.title, // Removed priority from title
                start: task.due_date,
                description: task.description,
                priority: task.priority,
                status: task.status
            }));
            successCallback(events);
        })
        .catch(failureCallback);
    }

    taskForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const id = document.getElementById('taskId').value;
        const taskData = {
            title: document.getElementById('title').value,
            due_date: document.getElementById('due_date').value, // Ensured due_date is sent
            priority: document.getElementById('priority').value,
            status: document.getElementById('status').value,
            description: document.getElementById('description').value
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `http://localhost:5000/tasks/${id}` : 'http://localhost:5000/tasks';

        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(taskData)
        })
        .then(res => res.json())
        .then(() => {
            modal.hide();
            calendar.refetchEvents();
        });
    });

    deleteTaskBtn.addEventListener('click', function () {
        const id = document.getElementById('taskId').value;
        if (!id) return;

        if (confirm('Are you sure you want to delete this task?')) {
            fetch(`http://localhost:5000/tasks/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(res => res.json())
            .then(() => {
                modal.hide();
                calendar.refetchEvents();
            });
        }
    });

    function resetForm() {
        taskForm.reset();
        document.getElementById('taskId').value = '';
        document.getElementById('priority').value = 'Low';
        document.getElementById('status').value = 'Pending';
    }
});
