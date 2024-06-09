import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Container, TextField, Button, Typography } from "@mui/material";
import {
  fetchTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  saveEditing,
  Todo,
} from "../utils/todoService";
import TodoList from "../components/TodoList";

interface TodoPageProps {
  user: any;
}

export default function TodoPage({ user }: TodoPageProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const loadTodos = async () => {
        try {
          const todos = await fetchTodos(user.id);
          setTodos(todos);
        } catch (error: any) {
          console.error(error.message);
        }
        setLoading(false);
      };

      loadTodos();
    }
  }, [user]);

  const handleAddTodo = async () => {
    try {
      const newTodo = await addTodo(user.id, task);
      setTodos([...todos, newTodo]);
      setTask("");
    } catch (error: any) {
      console.error("Error adding todo:", error.message);
    }
  };

  const handleUpdateTodo = async (id: number, isComplete: boolean) => {
    try {
      const updatedTodo = await updateTodo(id, isComplete);
      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
    } catch (error: any) {
      console.error("Error updating todo:", error.message);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error: any) {
      console.error("Error deleting todo:", error.message);
    }
  };

  const handleSaveEditing = async (id: number, task: string) => {
    try {
      const updatedTodo = await saveEditing(id, task);
      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
    } catch (error: any) {
      console.error("Error updating todo:", error.message);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <TextField
        label="New task"
        variant="outlined"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddTodo}
        fullWidth
      >
        Add Todo
      </Button>
      <TodoList
        todos={todos}
        onUpdate={handleUpdateTodo}
        onDelete={handleDeleteTodo}
        onSave={handleSaveEditing}
      />
    </Container>
  );
}
