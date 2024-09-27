import { useState, useRef, useEffect } from "react";
import TodoList from "./TodoList";
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [todos, setTodos] = useState([]);
  
  // ローカルストレージキー
  const LOCAL_STORAGE_KEY = 'todoApp.todos';

  // 初回レンダリング時にローカルストレージからタスクを読み込む
  useEffect(() => {
    try {
      const storedTodos = localStorage.getItem(LOCAL_STORAGE_KEY);
      console.log("Initial load: Stored todos:", storedTodos); // デバッグ用ログ
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
        console.log("Parsed todos loaded:", JSON.parse(storedTodos)); // デバッグ用ログ
      }
    } catch (e) {
      console.error("Failed to load todos from local storage:", e);
    }
  }, []);

  // todos が変更されるたびにローカルストレージに保存する
  useEffect(() => {
    if (todos.length > 0) { // 空配列の場合は保存しないよう修正
      try {
        console.log("Saving todos to local storage:", todos); // デバッグ用ログ
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
      } catch (e) {
        console.error("Failed to save todos to local storage", e);
      }
    }
  }, [todos]);

  const todoNameRef = useRef();

  const handleAddTodo = () => {
    const name = todoNameRef.current.value;
    if (name === "") return;

    setTodos((prevTodos) => [...prevTodos, { id: uuidv4(), name: name, completed: false }]);
    
    todoNameRef.current.value = null;
    
    console.log("Added new todo:", { id: uuidv4(), name: name, completed: false }); // デバッグ用ログ
  };

  const toggleTodo = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
    
    console.log("Toggled todo with ID:", id); // デバッグ用ログ
  };

  const handleClear = () => {
    setTodos((prevTodos) => prevTodos.filter((todo) => !todo.completed));
    
    console.log("Cleared completed todos"); // デバッグ用ログ
  };

return (
<div>
<TodoList todos={todos} toggleTodo={toggleTodo} />

{/* input フィールドへの id と name の追加 */}
<input 
type="text" 
ref={todoNameRef} 
id="new-todo" 
name="new-todo"
autoComplete="off"
/>

{/* ボタンにも id を追加しておくとデバッグやテストで便利です */}
<button onClick={handleAddTodo} id="add-todo-button">タスクを追加</button>
<button onClick={handleClear} id="clear-completed-button">完了したタスクの削除</button>

<div>残りのタスク:{todos.filter((todo) => !todo.completed).length}</div>
</div>
);
}

export default App;