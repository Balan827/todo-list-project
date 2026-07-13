/* Where we will add ourr interactions */

const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const completedCounter = document.getElementById("completed-counter");
const uncompletedCounter = document.getElementById("uncompleted-counter");


function updateCounters() {
    const completedTasks = document.querySelectorAll(".completed").length;
    const uncompletedTasks = document.querySelectorAll("li:not(.completed)").length;

    completedCounter.textContent = completedTasks;
    uncompletedCounter.textContent = uncompletedTasks;
}


function createTask(task) {
    const li = document.createElement("li");
    li.dataset.id = task.id;

    li.innerHTML = `
    <label>
    <input type="checkbox" ${task.completed ? "checked" : ""}>
    <span>${task.text}</span>
    </label>

    <span class="edit-btn">Edit</span>
    <span class="delete-btn">Delete</span>
    `;

    if (task.completed) {
        li.classList.add("completed");
    }
    
    listContainer.appendChild(li);

    //allow for manipulation of each task in list
const checkbox = li.querySelector("input");
const editBtn = li.querySelector(".edit-btn");
const taskSpan = li.querySelector("span");
const deleteBtn = li.querySelector(".delete-btn");

//when checkbox checked, moves to completed list
//updates HTML and SQLite db
checkbox.addEventListener("change", async function () {
    li.classList.toggle("completed", checkbox.checked);

    await fetch(`/tasks/${li.dataset.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text: taskSpan.textContent,
            completed: checkbox.checked
        })
    });
    updateCounters();
});


//promt function displays dialogue box asking for user input
//if cond checks if there is input to display
editBtn.addEventListener("click", async function () {
    const update = prompt("Edit task: ", taskSpan.textContent);

    if (update === null || update.trim() === "") {
        return;
    }

    taskSpan.textContent = update;

    await fetch(`/tasks/${li.dataset.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text: update,
            completed: checkbox.checked
        })
    });
});

deleteBtn.addEventListener("click", async function() {
    if (!confirm("Are you sure you want to delete this task?")) {
        return;
    }

    await fetch(`/tasks/${li.dataset.id}`, {
        method: "DELETE"
    });
    
    li.remove();
    updateCounters();
    });
}


async function addTask() {
    const task = inputBox.value.trim();

    if(!task) {
        alert("Please enter a task:");
        console.log("No task added");
        return;
    }
    const response = await fetch("/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text: task
        })

    });

    const newTask = await response.json();
    createTask(newTask);

    //clear input field
    inputBox.value = "";

}

inputBox.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});


//read current tasks when refeshing/reloading page
async function loadTasks() {
    listContainer.innerHTML = "";

    const response = await fetch("/tasks");
    const tasks = await response.json();

    tasks.forEach(createTask);
    updateCounters();
}

//load tasks when the page opens
window.onload = loadTasks;
