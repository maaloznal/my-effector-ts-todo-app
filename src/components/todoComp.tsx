import { useUnit } from "effector-react";
import {
  $filteredItemStore,
  $filterStatus,
  addTaskAsync,
  changeFilterStatus,
  deleteItem,
  toggleCompleted,
} from "../store/todoStore";
import { useState } from "react";

const TodoApp = () => {
  const tasks = useUnit($filteredItemStore);
  const filterStatus = useUnit($filterStatus);
  const addTask = useUnit(addTaskAsync);
  const removeTask = useUnit(deleteItem);
  const toggleTaskCompleted = useUnit(toggleCompleted);
  const setFilterStatus = useUnit(changeFilterStatus);

  const [newTaskText, setNewTaskText] = useState("");

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      const newTask = {
        id: Date.now(),
        text: newTaskText,
        completed: false,
      };
      addTask(newTask);
      setNewTaskText("");
    }
  };

  return (
    <div className="todo-app">
      <h1>Список задач</h1>
      <div className="input-container">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Введите задачу"
        />
        <button onClick={handleAddTask}>Добавить задачу</button>
      </div>

      <div className="filter-container">
        <label>
          <input
            type="radio"
            name="filter"
            checked={filterStatus === "all"}
            onChange={() => setFilterStatus("all")}
          />
          Все задачи
        </label>
        <label>
          <input
            type="radio"
            name="filter"
            checked={filterStatus === "completed"}
            onChange={() => setFilterStatus("completed")}
          />
          Завершенные
        </label>
        <label>
          <input
            type="radio"
            name="filter"
            checked={filterStatus === "deleted"}
            onChange={() => setFilterStatus("deleted")}
          />
          Удаленные
        </label>
      </div>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <span
              style={{
                textDecoration: task.completed ? "line-through" : "none",
                color: task.deleted ? "red" : "black",
              }}
            >
              {task.text}
            </span>
            {!task.deleted && (
              <div className="task-buttons">
                <button
                  className="complete"
                  onClick={() => toggleTaskCompleted(task.id)}
                >
                  {task.completed ? "Отменить" : "Завершить"}
                </button>
                <button className="delete" onClick={() => removeTask(task.id)}>
                  Удалить
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
