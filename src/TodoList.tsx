
import React from "react";
import type { Todo } from "./types";
import TodoItem from "./TodoItem"; // ◀◀ 追加

type Props = {
  todos: Todo[];
  updateIsDone: (id: string, value: boolean) => void;
  remove: (id: string) => void;
};

/*const TodoList = (props: Props) => {
  const todos = [...props.todos].sort((a, b) => {
  // ① 完了状態でソート
  if (a.isDone !== b.isDone) {
    return a.isDone ? 1 : -1; // 未完了が先
  }

  // ② 期限でソート
  if (a.deadline && b.deadline) {
    return a.deadline.getTime() - b.deadline.getTime(); // 早い方が先
  } else if (a.deadline && !b.deadline) {
    return -1; // 期限ありを先に
  } else if (!a.deadline && b.deadline) {
    return 1; // 期限なしを後に
  }

  return 0;
});*/

const TodoList = (props: Props) => {
  const todos = props.todos;

  if (todos.length === 0) {
    return (
      <div className="text-red-500">
        現在、登録されているタスクはありません。
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
        />
      ))}
    </div>
  );
};

export default TodoList;