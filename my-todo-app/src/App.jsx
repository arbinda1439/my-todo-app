import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('fl-todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem('fl-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    const text = inputValue.trim();
    if (!text) return;
    setTodos([{ id: crypto.randomUUID(), text, done: false }, ...todos]);
    setInputValue('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const clearDone = () => {
    setTodos(todos.filter(t => !t.done));
  };

  const filtered = filter === 'active'
    ? todos.filter(t => !t.done)
    : filter === 'done'
    ? todos.filter(t => t.done)
    : todos;

  const remaining = todos.filter(t => !t.done).length;
  const doneCount = todos.length - remaining;
  const progress = todos.length > 0 ? Math.round((doneCount / todos.length) * 100) : 0;

  return (
    <div className="fl-root">
      <div className="fl-header">
        <h1 className="fl-title">
          <span className="fl-title-dot" />
          Focus List
        </h1>
        <div className="fl-count-pill">
          <span className="fl-count-num">{remaining}</span>&nbsp;remaining
        </div>
      </div>

      <div className="fl-input-row">
        <input
          className="fl-input"
          type="text"
          placeholder="Add a task..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          maxLength={200}
        />
        <button className="fl-add-btn" onClick={addTodo}>+ Add</button>
      </div>

      <div className="fl-filter-row">
        {['all', 'active', 'done'].map(f => (
          <button
            key={f}
            className={`fl-filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {todos.length > 0 && (
        <div className="fl-progress">
          <div className="fl-progress-label">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="fl-progress-bar-bg">
            <div className="fl-progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      <ul className="fl-list">
        {filtered.map(todo => (
          <li
            key={todo.id}
            className={`fl-item ${todo.done ? 'done' : ''}`}
            onClick={() => toggleTodo(todo.id)}
          >
            <div className="fl-checkbox">
              {todo.done && <span className="fl-check-icon">✓</span>}
            </div>
            <span className="fl-text">{todo.text}</span>
            <button
              className="fl-delete-btn"
              onClick={(e) => { e.stopPropagation(); deleteTodo(todo.id); }}
              aria-label="Delete task"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <div className="fl-empty">
          <div className="fl-empty-icon">🎯</div>
          <p>Nothing on your radar.<br />Relax — or add something.</p>
        </div>
      )}

      <div className="fl-footer">
        {doneCount > 0 && (
          <button className="fl-clear-btn" onClick={clearDone}>
            Clear completed
          </button>
        )}
      </div>
    </div>
  );
}

export default App;