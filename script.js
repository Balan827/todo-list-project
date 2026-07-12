/* Where we will add ourr interactions */

const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const completedCounter = document.getElementById("completed-counter");
const uncompletedCounter = document.getElementById("uncompleted-counter");

//auto save tasks in todo list
function saveTasks() {
    const tasks = [];

    document.querySelectorAll("#list-chttp://localhost:3000ontainer li").forEach(li => {
        tasks.push({
            text: li.querySelector("label span").textContent,
            completed: li.querySelector("input").checked
        });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}


function updateCounters() {
    const completedTasks = document.querySelectorAll(".completed").length;
    const uncompletedTasks = document.querySelectorAll("li:not(.completed)").length;

    completedCounter.textContent = completedTasks;
    uncompletedCounter.textContent = uncompletedTasks;
}


function createTask(task) {
    const li = document.createElement("li");
    //li.dataset.id = task.id;

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
checkbox.addEventListener("click", function() {
    li.classList.toggle("completed", checkbox.checked);
    updateCounters();
    saveTasks();
});


//promt function displays dialogue box asking for user input
//if cond checks if there is input to display
editBtn.addEventListener("click", function () {
    const update = prompt("Edit task: ", taskSpan.textContent);
    if (update !== null) {
        taskSpan.textContent = update;
        li.classList.remove("completed");

        //uncheck th box and update counter
        checkbox.checked = false;
        updateCounters();
        saveTasks();
    }
});

deleteBtn.addEventListener("click", function() {
    if (confirm("Are you sure you want to delete this task?")) {
        li.remove();
        updateCounters();
        saveTasks();
    }
});
    updateCounters();
}


function addTask() {
    const task = inputBox.value.trim();

    if(!task) {
        alert("Please enter a task:");
        console.log("No task added");
        return;
    }

   createTask({
    text: task,
    completed: false
});

//clear input field
inputBox.value = "";

saveTasks();

}

inputBox.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});


//load tasks when the page opens

window.onload = function() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

    savedTasks.forEach(task => { 
        createTask(task);
    });
        
    updateCounters();
};
