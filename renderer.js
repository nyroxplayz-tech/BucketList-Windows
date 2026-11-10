const input = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const clearBtn = document.getElementById('clear-btn');

let tasks = JSON.parse(localStorage.getItem('bucketlist-tasks') || '[]');

function saveTasks() {
  localStorage.setItem('bucketlist-tasks', JSON.stringify(tasks));
}

function render() {
  taskList.innerHTML = '';

  const completed = tasks.filter(task => task.done).length;
  const total = tasks.length;
  const percent = total ? Math.round(completed / total * 100) : 0;

  document.getElementById('progress-count').textContent =
    `${completed} / ${total} completed`;

  document.getElementById('progress-percent').textContent = `${percent}%`;
  document.getElementById('progress-fill').style.width = `${percent}%`;

  if (!total) {
    taskList.innerHTML =
      '<div class="empty">✦ No tasks yet. Add your first goal above!</div>';
    return;
  }

  tasks.forEach(task => {
    const card = document.createElement('div');
    card.className = `task ${task.done ? 'done' : ''}`;

    const name = document.createElement('span');
    name.className = 'task-name';
    name.textContent = task.title;

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const complete = document.createElement('button');
    complete.className = 'complete-btn';
    complete.textContent = task.done ? 'Mark Active' : 'Mark Completed';
    complete.onclick = () => {
      task.done = !task.done;
      saveTasks();
      render();
    };

    const edit = document.createElement('button');
    edit.className = 'edit-btn';
    edit.textContent = 'Edit';
    edit.onclick = () => {
      const updated = prompt('Edit your goal:', task.title);
      if (updated !== null && updated.trim()) {
        task.title = updated.trim();
        saveTasks();
        render();
      }
    };

    const remove = document.createElement('button');
    remove.className = 'delete-btn';
    remove.textContent = 'Delete';
    remove.onclick = () => {
      if (confirm('Delete this goal?')) {
        tasks = tasks.filter(item => item.id !== task.id);
        saveTasks();
        render();
      }
    };

    actions.append(complete, edit, remove);
    card.append(name, actions);
    taskList.appendChild(card);
  });
}

function addTask() {
  const title = input.value.trim();
  if (!title) {
    input.focus();
    return;
  }

  tasks.push({
    id: Date.now(),
    title,
    done: false
  });

  input.value = '';
  saveTasks();
  render();
  input.focus();
}

addBtn.addEventListener('click', addTask);

input.addEventListener('keydown', event => {
  if (event.key === 'Enter') addTask();
});

clearBtn.addEventListener('click', () => {
  if (!tasks.some(task => task.done)) return;

  if (confirm('Clear all completed goals?')) {
    tasks = tasks.filter(task => !task.done);
    saveTasks();
    render();
  }
});

render();
