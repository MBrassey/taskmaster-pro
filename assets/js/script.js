var tasks = {};

var createTask = function (taskText, taskDate, taskList) {
    // create elements that make up a task item
    var taskLi = $("<li>").addClass("list-group-item");
    var taskSpan = $("<span>").addClass("badge badge-primary badge-pill").text(taskDate);
    var taskP = $("<p>").addClass("m-1").text(taskText);

    // append span and p element to parent li
    taskLi.append(taskSpan, taskP);

    // append to ul list on the page
    $("#list-" + taskList).append(taskLi);
};

var loadTasks = function () {
    tasks = JSON.parse(localStorage.getItem("tasks"));

    // if nothing in localStorage, create a new object to track all task status arrays
    if (!tasks) {
        tasks = {
            toDo: [],
            inProgress: [],
            inReview: [],
            done: [],
        };
    }

    // loop over object properties
    $.each(tasks, function (list, arr) {
        // then loop over sub-array
        arr.forEach(function (task) {
            createTask(task.text, task.date, list);
        });
    });
};

var saveTasks = function () {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

$(".list-group").on("click", "p", function () {
    var text = $(this);
    var textInput = $("<textarea>");
    $(this).replaceWith(textInput);
    textInput.trigger("focus").addClass("form-control").val(text).text().trim();
});

$(".list-group").on("blur", "textarea", function () {
    var text = $(this).val().trim();

    var status = $(this).closest(".list-group").attr("id").replace("list-", "");

    var index = $(this).closest(".list-group-item").index();

    tasks[status][index].text = text;
    saveTasks();

    var taskP = $("<p>").addClass("m-1").text(text);
    $(this).replaceWith(taskP);
});

$(".list-group").on("click", "span", function () {
    var date = $(this).text().trim();

    var dateInput = $("<input>").attr("type", "text").addClass("form-control").val(date);

    $(this).replaceWith(dateInput);

    dateInput.trigger("focus");
});

$(".list-group").on("blur", "input[type='text']", function () {
    var date = $(this).val().trim();

    var status = $(this).closest(".list-group").attr("id").replace("list-", "");

    var index = $(this).closest(".list-group-item").index();

    tasks[status][index].date = date;
    saveTasks();

    var taskSpan = $("<span>").addClass("vadge badge-priamry badge-pill").text(date);

    $(this).replaceWith(taskSpan);
});

$(".card .list-group").sortable({
    connectWith: $(".card .list-group"),
    scroll: false,
    tolerance: "pointer",
    helper: "clone",
    activate: function (event) {},
    deactivate: function (event) {},
    over: function (event) {},
    out: function (event) {},
    update: function (event) {
        var tempArr = [];

        $(this)
            .children()
            .each(function () {
                var text = $(this).find("p").text().trim();

                var date = $(this).find("span").text().trim();

                tempArr.push({
                    text: text,
                    date: date,
                });
            });

        var arrName = $(this).attr("id").replace("list-", "");

        tasks[arrName] = tempArr;
        saveTasks();
    },
});

$("#trash").droppable({
    accept: ".card .list-group-item",
    tolerance: "touch",
    drop: function (event, ui) {
        ui.draggable.remove();
    },
    over: function (event, ui) {
        console.log("over");
    },
    out: function (event, ui) {
        console.log("out");
    },
});

// modal was triggered
$("#task-form-modal").on("show.bs.modal", function () {
    // clear values
    $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function () {
    // highlight textarea
    $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function () {
    // get form values
    var taskText = $("#modalTaskDescription").val();
    var taskDate = $("#modalDueDate").val();

    if (taskText && taskDate) {
        createTask(taskText, taskDate, "toDo");

        // close modal
        $("#task-form-modal").modal("hide");

        // save in tasks array
        tasks.toDo.push({
            text: taskText,
            date: taskDate,
        });

        saveTasks();
    }
});

// remove all tasks
$("#remove-tasks").on("click", function () {
    for (var key in tasks) {
        tasks[key].length = 0;
        $("#list-" + key).empty();
    }
    saveTasks();
});

// load tasks for the first time
loadTasks();
