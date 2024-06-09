import {
  List,
  ListItem,
  Checkbox,
  TextField,
  Button,
  ListItemText,
} from "@mui/material";
import { format } from "date-fns";
import { Todo } from "../utils/todoService";
import { useState } from "react";

interface TodoListProps {
  todos: Todo[];
  onUpdate: (id: number, isComplete: boolean) => void;
  onDelete: (id: number) => void;
  onSave: (id: number, task: string) => void;
}

const TodoList = ({ todos, onUpdate, onDelete, onSave }: TodoListProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<string>("");

  const handleStartEditing = (id: number, task: string) => {
    setEditingId(id);
    setEditingTask(task);
  };

  const handleCancelEditing = () => {
    setEditingId(null);
    setEditingTask("");
  };

  const handleSaveEditing = async (id: number) => {
    onSave(id, editingTask);
    setEditingId(null);
    setEditingTask("");
  };

  return (
    <List>
      {todos.map((todo) => (
        <ListItem key={todo.id}>
          <Checkbox
            edge="start"
            checked={todo.is_complete}
            tabIndex={-1}
            disableRipple
            onChange={() => onUpdate(todo.id, !todo.is_complete)}
          />
          {editingId === todo.id ? (
            <TextField
              variant="outlined"
              value={editingTask}
              onChange={(e) => setEditingTask(e.target.value)}
              onBlur={() => handleSaveEditing(todo.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSaveEditing(todo.id);
                }
                if (e.key === "Escape") {
                  handleCancelEditing();
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
              onClick={() => handleStartEditing(todo.id, todo.task)}
            />
          )}
          <Button
            color="primary"
            onClick={() => onDelete(todo.id)}
            variant="text"
          >
            Delete
          </Button>
        </ListItem>
      ))}
    </List>
  );
};

export default TodoList;
