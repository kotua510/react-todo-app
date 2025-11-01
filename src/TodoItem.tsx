import React from "react";
import type { Todo } from "./types";

type Props = {
  todo: Todo; // ← 単数に修正！
  updateIsDone: (id: string, value: boolean) => void;
  remove: (id: string) => void;
};

const TodoItem = (props: Props) => {
  const { todo } = props; // 分割代入でもOK

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={todo.isDone}
          onChange={(e) => props.updateIsDone(todo.id, e.target.checked)}
          className="mr-1.5 cursor-pointer"
        />
        {todo.name} 優先度: {todo.priority}
      </div>
      <button
        onClick={() => props.remove(todo.id)}
        className="rounded-md bg-slate-200 px-2 py-1 text-sm font-bold text-white hover:bg-red-500"
      >
        削除
      </button>
    </div>
  );
};

export default TodoItem;