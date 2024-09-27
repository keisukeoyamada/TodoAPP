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
      const storedTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
      if (storedTodos) setTodos(storedTodos);
    } catch (e) {
      console.error("Failed to load todos from local storage:", e);
    }
  }, []);

  // todos が変更されるたびにローカストレージに保存する
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
      console.log("Todos saved to local storage:", todos); // デバッグ用ログ
    } catch (e) {
      console.error("Failed to save todos to local storage:", e);
    }
  }, [todos]);

  const todoNameRef = useRef();

  const handleAddTodo = () => {
    const name = todoNameRef.current.value.trim();
    if (name === "") return;

    setTodos((prevTodos) => [
      ...prevTodos,
      { id: uuidv4(), name: name, completed: false }
    ]);

    todoNameRef.current.value = '';
    todoNameRef.current.focus(); // フォーカス移動
  };

  const toggleTodo = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };
  
  const handleClearCompleted = () => {
    setTodos((prevTodos) => prevTodos.filter((todo) => !todo.completed));
  };
  
  return (
    <div>
      <TodoList todos={todos} toggleTodo={toggleTodo}/>
      <input type="text" ref={todoNameRef}></input>
      <button onClick={handleAddTodo}>タスクを追加</button>
      <button onClick={handleClearCompleted}>完了したタスクの削除</button>
      <div>残りのタスク:{todos.filter((todo) => !todo.completed).length}</div>
    </div>
  );
}

export default App;