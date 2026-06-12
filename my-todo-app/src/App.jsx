import { useState, useEffect } from 'react';
import './App.css'; // We will style this next

function App() {
  // 1. Initialize state. Try to fetch from localStorage first. 
  // If nothing is there, start with an empty array.
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('my-todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  
  const [inputValue, setInputValue] = useState('');

  // 2. Use useEffect to save todos to localStorage automatically 
  // every single time the 'todos' state changes.
  useEffect(() => {
    localStorage.setItem('my-todos', JSON.stringify(todos));
  }, [todos]);

  // 3. Function to add a new todo
  const addTodo = (e) => {
    e.preventDefault(); // Prevents the page from refreshing on form submit
    if (!inputValue.trim()) return; // Don't add empty todos

    const newTodo = {
      id: crypto.randomUUID(), // Generates a unique ID
      text: inputValue,
      isCompleted: false
    };

    setTodos([...todos, newTodo]);
    setInputValue(''); // Clear the input field
  };

  // 4. Function to toggle complete status
  const toggleTodo = (id) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, isCompleted: !todo.isCompleted };
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  // 5. Function to delete a todo
  const deleteTodo = (id) => {
    const remainingTodos = todos.filter(todo => todo.id !== id);
    setTodos(remainingTodos);
  };

  return (
    <div className="app-container">
      <h1>My Todo List</h1>
      
      {/* Input Form */}
      <form onSubmit={addTodo} className="todo-form">
        <input 
          type="text" 
          placeholder="What needs to be done?" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {/* Todo List */}
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className={todo.isCompleted ? 'completed' : ''}>
            <span onClick={() => toggleTodo(todo.id)}>
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)} className="delete-btn">
              ✕
            </button>
          </li>
        ))}
      </ul>
      
      {todos.length === 0 && <p className="empty-message">No tasks yet. Add one above!</p>}
    </div>
  );
}

export default App;