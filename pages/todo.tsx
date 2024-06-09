import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
// import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
// import IconButton from "@mui/material/IconButton";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";

interface Todo {
  id: number;
  user_id: string;
  task: string;
  is_complete: boolean;
  inserted_at: string;
}

interface TodoPageProps {
  user: any;
}

export default function TodoPage({ user }: TodoPageProps) {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: todos, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error(error.message);
      } else {
        setTodos(todos);
      }
      setLoading(false);
    };

    fetchTodos();
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
          <ListItem key={todo.id} button>
            <Checkbox
              edge="start"
              checked={todo.is_complete}
              tabIndex={-1}
              disableRipple
              onChange={() => updateTodo(todo.id, !todo.is_complete)}
            />
            <ListItemText
              primary={todo.task}
              secondary={`Completed: ${
                todo.is_complete ? "Yes" : "No"
              }, Inserted at: ${todo.inserted_at}`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
