import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";

interface Todo {
  id: number;
  user_id: string;
  task: string;
  is_completed: boolean;
  inserted_at: string;
}

export default function TodoPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndTodos = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        router.push("/login");
        return;
      }
      setUser(user);

      const { data: todos, error: todosError } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", user.id);

      if (todosError) {
        console.error(todosError.message);
      } else {
        setTodos(todos);
      }

      setLoading(false);
    };

    fetchUserAndTodos();
  }, [router]);

  const addTodo = async () => {
    const { data, error } = await supabase
      .from("todos")
      .insert([{ user_id: user.id, task, is_complete: false }])
      .select("*");

    if (error) {
      console.error("Error adding todo:", error.message);
    } else {
      setTodos([...todos, data[0]]);
      setTask("");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Todo List</h1>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Todo task"
      />
      <button onClick={addTodo}>Add Todo</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <h3>{todo.task}</h3>
            <p>Completed: {todo.is_completed ? "Yes" : "No"}</p>
            <p>Inserted at: {todo.inserted_at}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
