import React, { useState } from "react";
import createsound from "./sound/create.mp3";
import deletesound from "./sound/delete.mp3";

type Props = {
  parentId: string;
  addSubTodo: (parentId: string, name: string) => void;
  removeCompletedSubTodos: (parentId: string) => void;
};

const delete_sound = new Audio(deletesound)
const create_sound = new Audio(createsound)
const SubTodoInput = ({ parentId, addSubTodo, removeCompletedSubTodos }: Props) => {
  const [name, setName] = useState("");
  const handleAdd = () => {
    if (!name.trim()) return;
    addSubTodo(parentId, name.trim());
    setName("");
  };

  const handleRemoveCompleted = () => {
    removeCompletedSubTodos(parentId);
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border rounded-md p-1 text-sm"
        placeholder="子分を追加..."
      />
      <button
        onClick={() => {
          create_sound.play();
          handleAdd()
        }}
        className="rounded-md bg-blue-400 px-2 py-1 text-white text-sm hover:bg-blue-500"
      >
        追加
      </button>
      <button
        onClick={() => {
          delete_sound.play();
          handleRemoveCompleted()
        }}
        className="rounded-md bg-red-500 px-2 py-1 text-white text-sm hover:bg-red-600"
      >
        完了した子分を削除
      </button>
    </div>
  );
};

export default SubTodoInput;