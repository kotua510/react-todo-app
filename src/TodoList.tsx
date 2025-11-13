import React from "react";
import type { Todo } from "./types";
import TodoItem from "./TodoItem";

type Props = {
  todos: Todo[];
  updateIsDone: (id: string, value: boolean) => void;
  remove: (id: string) => void;
  updateMemo: (id: string, newMemo: string) => void;
  updateSubIsDone: (todoId: string, subId: string) => void; // ← 追加！
  addSubTodo: (parentId: string, name: string) => void;
  removeSubTodo:(parentId: string, subId: string) => void;
  removeCompletedSubTodos:(parentId: string) => void;
};

const TodoList = (props: Props) => {
  const todos = props.todos; 
  if (todos.length === 0) {
    return (
      <div className="text-red-500">
        現在、為すべきことはありません!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          remove={props.remove}
          updateIsDone={props.updateIsDone}
          updateMemo={props.updateMemo}
          updateSubIsDone={props.updateSubIsDone}
          addSubTodo={props.addSubTodo} 
          removeSubTodo={props.removeSubTodo}
          removeCompletedSubTodos = {props.removeCompletedSubTodos}

        />
      ))}
    </div>
  );
};

export default TodoList;
