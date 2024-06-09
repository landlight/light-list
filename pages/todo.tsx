import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { format } from "date-fns";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";

interface Todo {
  id: number;
  user_id: string;
  task: string;
  is_complete: boolean;
  inserted_at: string;
  deleted_at: string;
}

interface TodoPageProps {
  user: any;
}

export default function TodoPage({ user }: TodoPageProps) {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<string>("");

  useEffect(() => {
    if (user) {
      const fetchTodos = async () => {
        const { data: todos, error } = await supabase
          .from("todos")
          .select("*")
          .is("deleted_at", null)
          .eq("user_id", user.id);

        if (error) {
          console.error(error.message);
        } else {
          setTodos(todos);
        }
        setLoading(false);
      };

      fetchTodos();
    }
  }, [user, router]);

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

  const updateTodo = async (id: number, isComplete: boolean) => {
    const { data, error } = await supabase
      .from("todos")
      .update({ is_complete: isComplete })
      .eq("id", id)
      .select("*");

    if (error) {
      console.error("Error updating todo:", error.message);
    } else {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, is_complete: isComplete } : todo
        )
      );
    }
  };

  const deleteTodo = async (id: number) => {
    const { data, error } = await supabase
      .from("todos")
      .update({ deleted_at: new Date() })
      .eq("id", id);

    if (error) {
      console.error("Error deleting todo:", error.message);
    } else {
      setTodos(todos.filter((todo) => todo.id !== id));
    }
  };

  const startEditing = (id: number, task: string) => {
    setEditingId(id);
    setEditingTask(task);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingTask("");
  };

  const saveEditing = async (id: number) => {
    const { data, error } = await supabase
      .from("todos")
      .update({ task: editingTask })
      .eq("id", id)
      .select("*");

    if (error) {
      console.error("Error updating todo:", error.message);
    } else {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, task: editingTask } : todo
        )
      );
      setEditingId(null);
      setEditingTask("");
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
      <Button variant="contained" color="primary" onClick={addTodo} fullWidth>
        Add Todo
      </Button>
      <List>
        {todos.map((todo) => (
          <ListItem key={todo.id}>
            <Checkbox
              edge="start"
              checked={todo.is_complete}
              tabIndex={-1}
              disableRipple
              onChange={() => updateTodo(todo.id, !todo.is_complete)}
            />
            {editingId === todo.id ? (
              <TextField
                variant="outlined"
                value={editingTask}
                onChange={(e) => setEditingTask(e.target.value)}
                onBlur={() => saveEditing(todo.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    saveEditing(todo.id);
                  } else if (e.key === "Escape") {
                    cancelEditing();
                  }
                }}
                fullWidth
              />
            ) : (
              <ListItemText
                primary={todo.task.toUpperCase()}
                secondary={`Created at: ${format(
                  new Date(todo.inserted_at),
                  "MMMM dd, yyyy HH:mm"
                )}`}
                onClick={() => startEditing(todo.id, todo.task)}
              />
            )}
            <Button
              color="primary"
              onClick={() => deleteTodo(todo.id)}
              variant="text"
            >
              Delete
            </Button>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
