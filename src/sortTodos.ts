import type { Todo } from "./types";

export function sortTodos_isdone(todos: Todo[]) {
  return [...todos].sort((a, b) => {
    if (a.isDone !== b.isDone) {
      return a.isDone ? 1 : -1;
    }

    if (a.deadline && b.deadline) {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    } else if (a.deadline && !b.deadline) {
      return -1;
    } else if (!a.deadline && b.deadline) {
      return 1;
    }

    return 0;
  });
}

export function sortTodos_limit(todos: Todo[]) {
  return [...todos].sort((a, b) => {

    if (a.deadline && b.deadline) {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    } else if (a.deadline && !b.deadline) {
      return -1;
    } else if (!a.deadline && b.deadline) {
      return 1;
    }

    return 0;
  });
}

export function sortTodos_all(todos: Todo[]) {
  return [...todos].sort((a, b) => {
    if (a.isDone !== b.isDone) {
      return a.isDone ? 1 : -1;
    }

    if (a.deadline && b.deadline) {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    } else if (a.deadline && !b.deadline) {
      return -1;
    } else if (!a.deadline && b.deadline) {
      return 1;
    }

    return 0;
  });
}