import { supabase } from "./supabaseClient";

export interface Todo {
  id: number;
  user_id: string;
  task: string;
  is_complete: boolean;
  inserted_at: string;
  deleted_at: string;
}

export const fetchTodos = async (userId: string) => {
  const { data: todos, error } = await supabase
    .from("todos")
    .select("*")
    .is("deleted_at", null)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return todos as Todo[];
};

export const addTodo = async (userId: string, task: string) => {
  const { data, error } = await supabase
    .from("todos")
    .insert([{ user_id: userId, task, is_complete: false }])
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data[0] as Todo;
};

export const updateTodo = async (id: number, isComplete: boolean) => {
  const { data, error } = await supabase
    .from("todos")
    .update({ is_complete: isComplete })
    .eq("id", id)
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data[0] as Todo;
};

export const deleteTodo = async (id: number) => {
  const { data, error } = await supabase
    .from("todos")
    .update({ deleted_at: new Date() })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const saveEditing = async (id: number, task: string) => {
  const { data, error } = await supabase
    .from("todos")
    .update({ task })
    .eq("id", id)
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data[0] as Todo;
};
