/* Where we will add ourr interactions */
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const completedCounter = document.getElementById("completed-counter");
const uncompletedCounter = document.getElementById("uncompleted-counter");

function updateCounters() {
    const completedTasks = document.querySelectorAll(".completed").length;
    const uncompletedTasks = document.querySelectorAll("li:not(.compeleted)").length;

    completedCounter.textContent = completedTasks;
    uncompletedCounter.textContent = uncompletedTasks;
}


function addTask() {
    const task = inputBox.value.trim();
    if (!task) {
        alert("Please enter a task");
        console.log("No task added");
        return;
    }

 const li = document.createElement("li");
 li.innerHTML = `
  <label>
    <input type="checkbox">
    <span>${task}</span>
  </label>
  <span class="edit-btn">Edit</span>
  <span class="delete-btn">Delete</span>
`;

listContainer.appendChild(li);

//clear input field
inputBox.value = "";

//allow for manipulation of each task in list
const checkbox = li.querySelector("input");
const editBtn = li.querySelector(".edit-btn");
const taskSpan = li.querySelector("span");
const deleteBtn = li.querySelector(".delete-btn");

//when checkbox checked, moves to completed list
checkbox.addEventListener("click", function() {
    li.classList.toggle("completed", checkbox.checked);
    updateCounters();

});

checkbox.addEventListener("click", function () {
    li.classList.toggle("completed", checkbox.checked);
    updateCounters();
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
    }
});

deleteBtn.addEventListener("click", function() {
    if (confirm("Are you sure you want to delete this task?")) {
        li.remove();
        updateCounters();
    }
});
    updateCounters();
}

inputBox.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});
