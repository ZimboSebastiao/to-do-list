document.addEventListener('DOMContentLoaded', function () {
    const ftList = document.getElementById('ft_list');
    const saveTaskBtn = document.getElementById('saveTaskBtn');
    const taskInput = document.getElementById('taskInput');
    const taskDesc = document.getElementById('taskDesc');
    const taskAuthor = document.getElementById('taskAuthor');
    let editingTask = null;

    const forbiddenWords = ["puta", "vadia", "cona", "macaca", "macaco", "caralho", "vagabunda", "burra", "besta", "vagina", "penis", "pênis", "pau", "buceta", "lésbica", "lesbica", "lesbian", "sapatão", "sapatao", "sapa", "africa", "áfrica", "escura", "preta", "prostituta", "pipito", "piça", "pica", "merda"];;

    function containsForbiddenWords(text) {
        return forbiddenWords.some(word => text.toLowerCase().includes(word));
    }

    function saveTasks() {
        const tasks = [...document.querySelectorAll('.task')].map(task => ({
            title: task.querySelector('.task-title').textContent,
            desc: task.querySelector('.task-desc').textContent,
            author: task.querySelector('.task-author').textContent.split(' - ')[0],
            date: task.dataset.date
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => createTask(task.title, task.desc, task.author, task.date));
    }

    function createTask(title, desc, author, date = null) {
        if (!title || !desc || !author) return alert("Todos os campos são obrigatórios!");
        
        if (containsForbiddenWords(title) || containsForbiddenWords(desc) || containsForbiddenWords(author)) {
            return alert("Seu texto contém palavras proibidas!");
        }
        
        if (!date) {
            date = new Date().toLocaleString();
        }
        
        if (editingTask) {
            editingTask.querySelector('.task-title').textContent = title;
            editingTask.querySelector('.task-desc').textContent = desc;
            editingTask.querySelector('.task-author').textContent = `${author} - ${date}`;
            editingTask.dataset.date = date;
            editingTask = null;
        } else {
            const taskDiv = document.createElement('div');
            taskDiv.className = 'task';
            taskDiv.dataset.date = date;
            
            taskDiv.innerHTML = `
                <div class='div-task'>
                    <p class='task-title'>${title}</p>
                    <p class='task-desc'>${desc}</p><br>
                    <p class='task-author'>${author} - ${date}</p>
                </div>
                <div class='task-actions'>
                    <button class='btn-edit'>✏️</button>
                    <button class='btn-delete'>🗑️</button>
                </div>
            `;
            
            taskDiv.querySelector('.btn-edit').addEventListener('click', () => {
                taskInput.value = title;
                taskDesc.value = desc;
                taskAuthor.value = author;
                editingTask = taskDiv;
                new bootstrap.Modal(document.getElementById('taskModal')).show();
            });
            
            taskDiv.querySelector('.btn-delete').addEventListener('click', () => {
                if (confirm('Deseja realmente excluir esta tarefa?')) {
                    taskDiv.remove();
                    saveTasks();
                }
            });
            
            ftList.prepend(taskDiv);
        }
        
        saveTasks();
    }

    saveTaskBtn.addEventListener('click', () => {
        createTask(taskInput.value.trim(), taskDesc.value.trim(), taskAuthor.value.trim());
        taskInput.value = taskDesc.value = taskAuthor.value = '';
        bootstrap.Modal.getInstance(document.getElementById('taskModal')).hide();
    });

    loadTasks();
});