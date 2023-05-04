'use strict';

const form = document.querySelector('.create-task-form');
const filter = document.querySelector('.filter-input');
const taskInput = document.querySelector('.task-input');
const taskList = document.querySelector('.collection');
const clearBtn = document.querySelector('.clear-tasks');

loadEventListeners();

function loadEventListeners() {
    document.addEventListener('DOMContentLoaded', getTasks);
    form.addEventListener('submit', addTask);
    taskList.addEventListener('click', removeTask);
    // Edit task event
    taskList.addEventListener('click', editTask);
    clearBtn.addEventListener('click', clearTasks);
    filter.addEventListener('keyup', filterTasks);
}

function getTasks() {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    tasks.forEach(function (task) {
        createTaskElement(task);
    });
}

function addTask(e) {
    if (taskInput.value.trim() === '') {
        e.preventDefault();
        return null;
    }
    // Moved logic to external function
    createTaskElement(taskInput.value);
    storeTaskInLocalStorage(taskInput.value);
    taskInput.value = '';

    e.preventDefault();
}

// Edit Task
function editTask(e) {
    // Guard clause
    if (!e.target.parentElement.classList.contains('edit-item')) {
        return;
    }
    // I don't like next line, but didn't want to spend more time finding better solution
    const taskText = e.target.closest('li').firstChild;
    const oldText = taskText.textContent;
    const updatedTaskText = prompt('Редагування задачі', oldText);

    // Guard clause if user hits 'Cancel' in promt
    if (!updatedTaskText) {
        return;
    }

    taskText.innerText = updatedTaskText;
    interactWithTasksInLocalStorage(oldText, 'update', updatedTaskText);
}

// Create element logic moved to external function
// Also task text now wraped in span element
// yes,
function createTaskElement(value) {
    const li = document.createElement('li');
    li.className = 'collection-item';
    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.innerText = value;
    li.appendChild(taskText);
    const taskEdit = document.createElement('span');
    taskEdit.className = 'edit-item secondary-content';
    taskEdit.innerHTML = '<i class="fa fa-edit"></i>';
    li.appendChild(taskEdit);
    const taskDelete = document.createElement('span');
    taskDelete.className = 'delete-item secondary-content';
    taskDelete.innerHTML = '<i class="fa fa-remove"></i>';
    li.appendChild(taskDelete);
    taskList.appendChild(li);
}

function storeTaskInLocalStorage(task) {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    tasks.push(task);

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeTask(e) {
    if (e.target.parentElement.classList.contains('delete-item')) {
        if (confirm('Ви впевнені що хочете видалити це завдання?')) {
            e.target.parentElement.parentElement.remove();

            interactWithTasksInLocalStorage(
                e.target.parentElement.parentElement.textContent
            );
        }
    }
}

// Extended method to make it work in 'edit' mode
// looks awful, but wanted to save time
function interactWithTasksInLocalStorage(
    taskItemText,
    mode = 'delete',
    updatedTask = null
) {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    tasks.forEach(function (task, index) {
        if (taskItemText === task) {
            if (mode === 'delete') {
                tasks.splice(index, 1);
            }
            if (mode === 'update') {
                tasks[index] = updatedTask;
            }
        }
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function clearTasks() {
    while (taskList.firstChild) {
        taskList.removeChild(taskList.firstChild);
    }

    clearTasksFromLocalStorage();
}

function clearTasksFromLocalStorage() {
    localStorage.clear();
}

function filterTasks(e) {
    const text = e.target.value.toLowerCase();

    document.querySelectorAll('.collection-item').forEach(function (task) {
        const item = task.firstChild.textContent;
        if (item.toLowerCase().includes(text.toLowerCase())) {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    });
}
