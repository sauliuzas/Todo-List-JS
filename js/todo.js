var todo = {
  input: null,
  button: null,
  list: null,
  category: null,
  privatebtn: null,
  lockbtn: null,
  begin: function () {
    // GET ELEMENTS
    todo.input = document.getElementById("todo-input");
    todo.button = document.getElementById("todo-button");
    todo.list = document.getElementById("todo-list");
    todo.category = document.getElementById("todo-category");
    todo.privatebtn = document.getElementById("private-button");
    todo.lockbtn = document.getElementById("lock");

    // ADD EVENT LISTENERS
    todo.button.addEventListener("click", todo.addNew);
    todo.list.addEventListener("click", todo.handleTask);
    todo.privatebtn.addEventListener("click", todo.handlePrivate);

    //LOAD LOCAL STORAGE
    todo.getLocalStorage();
  },

  addNew: function (event) {
    event.preventDefault();

    const alertLabel = document.getElementById("alert");

    if (todo.input.value != "") {
      // TODO DIV
      const todoDiv = document.createElement("div");
      todoDiv.setAttribute("id", todo.category.value);

      if (todo.category.value === "all") {
        todoDiv.classList.add("todo");

        //ADD TO LOCAL STORAGE
        todo.todoLocalStorage(todo.input.value, "regular");
      } else if (todo.category.value === "private") {
        todoDiv.classList.add("todo-private");

        //ADD TO LOCAL STORAGE
        todo.todoLocalStorage(todo.input.value, "private");
      }

      //TODO LI
      const todoElement = document.createElement("li");
      todoElement.innerText = todo.input.value;
      todoElement.classList.add("todo-object");
      todoDiv.appendChild(todoElement);

      //BUTTON CONTAINER
      const btnContainer = document.createElement("div");
      btnContainer.classList.add("btn-container");
      todoDiv.appendChild(btnContainer);

      //COMPLETED BUTTON
      const completedButton = document.createElement("button");
      completedButton.innerHTML = '<i class="fas fa-check"></i>';
      completedButton.classList.add("complete-btn");
      btnContainer.appendChild(completedButton);

      //DELETE BUTTON
      const deleteButton = document.createElement("button");
      deleteButton.innerHTML = '<i id="delete-btn" class="fas fa-trash"></i>';
      deleteButton.classList.add("delete-btn");
      btnContainer.appendChild(deleteButton);

      //DISPLAY DIV
      todo.list.appendChild(todoDiv);
      todo.input.value = "";

      alertLabel.style.display = "none";
    } else {
      alertLabel.style.display = "flex";
    }
  },

  handleTask: function (e) {
    const task = e.target;

    //DELETE NOTE
    if (task.classList[0] === "delete-btn") {
      const taskcontainer = task.parentElement.parentElement;
      if (taskcontainer.classList.contains("todo")) {
        todo.removeLocalTodos(taskcontainer, "regular");
      } else if (taskcontainer.classList.contains("todo-private")) {
        todo.removeLocalTodos(taskcontainer, "private");
      }
      taskcontainer.classList.add("fly");
      setTimeout(() => {
        taskcontainer.remove();
      }, 500);
    }

    //MARK NOTE AS COMPLETED
    if (task.classList[0] === "complete-btn") {
      const taskcontainer = task.parentElement.parentElement;
      if (taskcontainer.classList[0] === "todo") {
        taskcontainer.classList.replace("todo", "todo-completed");
      } else if (taskcontainer.classList[0] === "todo-completed") {
        taskcontainer.classList.replace("todo-completed", "todo");
      } else if (taskcontainer.classList[0] === "todo-private") {
        taskcontainer.classList.replace(
          "todo-private",
          "todo-private-completed"
        );
      } else if (taskcontainer.classList[0] === "todo-private-completed") {
        taskcontainer.classList.replace(
          "todo-private-completed",
          "todo-private"
        );
      }
    }
  },

  handlePrivate: function (event) {
    event.preventDefault();
    lockIcon = document.getElementById("lock");
    const privateTodos = todo.list.childNodes;

    // SHOW OR HIDE PRIVATE NOTES
    privateTodos.forEach(function (todo) {
      if (
        todo.classList.contains("todo-private") ||
        todo.classList.contains("todo-private-completed")
      ) {
        if (todo.style.display === "none") {
          todo.style.display = "flex";
          lockIcon.classList.replace("fa-lock", "fa-lock-open");
        } else {
          todo.style.display = "none";
          lockIcon.classList.replace("fa-lock-open", "fa-lock");
        }
      } else {
      }
    });
  },

  todoLocalStorage: function (todo, type) {
    let localRegular;
    let localPrivate;

    //CHECK IF NOTES EXIST IN LOCAL STORAGE
    if (type === "regular") {
      if (localStorage.getItem("localRegular") === null) {
        localRegular = [];
      } else {
        localRegular = JSON.parse(localStorage.getItem("localRegular"));
      }
      localRegular.push(todo);
      localStorage.setItem("localRegular", JSON.stringify(localRegular));
    } else if (type === "private") {
      if (localStorage.getItem("localPrivate") === null) {
        localPrivate = [];
      } else {
        localPrivate = JSON.parse(localStorage.getItem("localPrivate"));
      }
      localPrivate.push(todo);
      localStorage.setItem("localPrivate", JSON.stringify(localPrivate));
    }
  },

  getLocalStorage: function () {
    let type = ["localRegular", "localPrivate"];

    todolist = document.getElementById("todo-list");

    type.forEach((todoType) => {
      //CHECK IF NOTES EXIST IN LOCAL STORAGE
      if (localStorage.getItem(todoType) === null) {
        todoType = [];
      } else {
        noteType = todoType;
        todoType = JSON.parse(localStorage.getItem(todoType));
      }
      todoType.forEach(function (todo) {
        const todoDiv = document.createElement("div");

        if (noteType === "localRegular") {
          // REGULAR NOTES
          todoDiv.classList.add("todo");
          todoDiv.setAttribute("id", "all");
        } else if (noteType === "localPrivate") {
          // PRIVATE NOTES
          todoDiv.classList.add("todo-private");
          todoDiv.setAttribute("id", "private");
        }

        //TODO LI
        const todoElement = document.createElement("li");
        todoElement.innerText = todo;
        todoElement.classList.add("todo-object");
        todoDiv.appendChild(todoElement);

        //BUTTON CONTAINER
        const btnContainer = document.createElement("div");
        btnContainer.classList.add("btn-container");
        todoDiv.appendChild(btnContainer);

        //COMPLETED BUTTON
        const completedButton = document.createElement("button");
        completedButton.innerHTML = '<i class="fas fa-check"></i>';
        completedButton.classList.add("complete-btn");
        btnContainer.appendChild(completedButton);

        //DELETE BUTTON
        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<i id="delete-btn" class="fas fa-trash"></i>';
        deleteButton.classList.add("delete-btn");
        btnContainer.appendChild(deleteButton);

        //DISPLAY DIV
        todolist.appendChild(todoDiv);
      });
    });
  },

  removeLocalTodos: function (todos, type) {
    let localRegular;
    let localPrivate;

    if (type === "regular") {
      //LOCAL STORAGE REGULAR NOTES
      if (localStorage.getItem("localRegular") === null) {
        localRegular = [];
      } else {
        localRegular = JSON.parse(localStorage.getItem("localRegular"));
      }

      const todoIndex = todos.children[0].innerText;
      localRegular.splice(localRegular.indexOf(todoIndex), 1);
      localStorage.setItem("localRegular", JSON.stringify(localRegular));
    } else if (type === "private") {
      //LOCAL STORAGE PRIVATE NOTES
      if (localStorage.getItem("localPrivate") === null) {
        localPrivate = [];
      } else {
        localPrivate = JSON.parse(localStorage.getItem("localPrivate"));
      }

      const todoIndex = todos.children[0].innerText;
      localPrivate.splice(localPrivate.indexOf(todoIndex), 1);
      localStorage.setItem("localPrivate", JSON.stringify(localPrivate));
    }
  },
};

window.addEventListener("load", todo.begin);
