import React, { useState } from "react";
import type { Todo } from "./types";
import SubTodoInput from "./SubTodoInput";
import createsound from "./sound/create.mp3";
import deletesound from "./sound/delete.mp3";
import clicksound from "./sound/click.mp3";

type Props = {
  todo: Todo;
  updateIsDone: (id: string, value: boolean) => void;
  remove: (id: string) => void;
  updateMemo: (id: string, newMemo: string) => void;
  updateSubIsDone: (todoId: string, subId: string) => void; // ✅ 追加
   addSubTodo: (parentId: string, name: string) => void;
   removeSubTodo:(parentId: string, subId: string) => void;
   removeCompletedSubTodos:(parentId: string) => void;
};

const delete_sound = new Audio(deletesound)
const create_sound = new Audio(createsound)
const click_sound = new Audio(clicksound)


const TodoItem = (props: Props) => {
  const { todo } = props;

  const [showMemo, setShowMemo] = useState(false);
  const [showSub, setShowSub] = useState(false); // ✅ サブタスク表示用
  const [memoText, setMemoText] = useState(todo.memo || "");
  const [memoPos, setMemoPos] = useState({ top: 0, left: 0 }); // ✅ メモ位置を保持




  const toggleMemo = (event: React.MouseEvent<HTMLButtonElement>) =>{
    const rect = event.currentTarget.getBoundingClientRect();

  // ページ全体のスクロールを考慮して座標を保存
  setMemoPos({
    top: rect.top + window.scrollY + 10, // ボタンより少し下に表示
    left: rect.left + window.scrollX - 260, // 左に260pxずらす（右に出したい場合は+に）
  });
    setShowMemo(!showMemo);
    click_sound.play();
  } 

  
  const toggleSubTasks = () => {
    setShowSub(!showSub);
    click_sound.play();
  } // ✅ 定義
  const saveMemo = () => {
    props.updateMemo(todo.id, memoText);
    setShowMemo(false);
  };

  // 期限関係の処理
  const nowtime = new Date();
  const due = todo.deadline ? new Date(todo.deadline) : null;


  let bg_color = "";
  let protext = "";

  if (todo.priority === "やばいかも..🤔"){
    todo.exp = 100;
  }else if (todo.priority === "やばいッ🙃"){
    todo.exp = 200;
  }else if (todo.priority === "あっかーん!☠"){
    todo.exp = 300;
  }

  if (due) {
    const diffdays = Math.ceil(
      (due.getTime() - nowtime.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffdays < 0) {
      bg_color = "bg-red-300";
      protext = `${todo.name} | 優先度: ${todo.priority} | 期限は過去!`;
    } else if (diffdays <= 7) {
      bg_color = "bg-yellow-200";
      protext = `${todo.name} | 優先度: ${todo.priority} | 残り${diffdays}日`;
    } else {
      protext = `${todo.name} | 優先度: ${todo.priority} | 残り${diffdays}日`;
    }
  } else {
    protext = `${todo.name} | 優先度: ${todo.priority}`;
  }

  if (todo.isDone) {
    bg_color = "bg-blue-300";
  }


  return (
    <div
  className={`flex flex-col rounded-md border-2 p-3 ${bg_color} transition-all duration-300`}
>
      {/* 1️⃣ タスクの基本部分 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={todo.isDone}
            onChange={(e) => props.updateIsDone(todo.id, e.target.checked)}
            className="mr-1.5 cursor-pointer"
          />
          {protext}
        </div>

        <div className="flex items-center gap-x-2">
          <button
            onClick={toggleSubTasks}
            className="rounded-md bg-slate-200 px-2 py-1 text-sm font-bold text-white hover:bg-fuchsia-400"
          >
            子分
          </button>

          <button
            onClick={(e)=>toggleMemo(e)}
            className="rounded-md bg-slate-200 px-2 py-1 text-sm font-bold text-white hover:bg-green-500"
          >
            メモ
          </button>

          <button
            onClick={() => {
              delete_sound.play();    
              props.remove(todo.id)
            }}
            className="rounded-md bg-slate-200 px-2 py-1 text-sm font-bold text-white hover:bg-red-500"
          >
            削除
          </button>
        </div>
      </div>

      {/* 2️⃣ サブタスク表示部分 */}
{showSub && (
  <div className="ml-6 mt-2 space-y-1">
    {todo.subTodos.length === 0 && (
      <div className="text-sm text-gray-400">子分はまだいません</div>
    )}

    {todo.subTodos.map((sub) => (
      <div key={sub.id} className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={sub.isDone}
          onChange={() => props.updateSubIsDone(todo.id, sub.id)}
          className="cursor-pointer"
        />
        <span className={sub.isDone ? "line-through text-gray-400" : ""}>
          {sub.name}
        </span>

        {/* 👇 削除ボタンを追加 */}


        <button
          onClick={() => {
            props.removeSubTodo(todo.id, sub.id)
            delete_sound.play();
          }}
          className="rounded-md bg-red-400 px-2 py-0.5 text-xs text-white hover:bg-red-500"
        >
          削除
        </button>
      </div>
    ))}

    {/* 👇 子分追加欄 */}
    <SubTodoInput parentId={todo.id} addSubTodo={props.addSubTodo} removeCompletedSubTodos={props.removeCompletedSubTodos} />
  </div>
)}


      {/* 3️⃣ メモウィンドウ */}
      {showMemo && (
        <div className="absolute right-10 top-12 z-10 w-64 rounded-md border bg-white p-3 shadow-lg"
        style={{ top: memoPos.top, left: memoPos.left }} // ✅ ここで動的座標適用
        >
          <h3 className="font-bold mb-2">メモを書く</h3>
          <textarea
            value={memoText}
            onChange={(e) => setMemoText(e.target.value)}
            className="w-full rounded-md border p-2 text-sm"
            placeholder="メモを入力..."
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              onClick={() =>{
                click_sound.play();
                saveMemo();
              }}
              className="rounded-md bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600"
            >
              保存
            </button>
            <button
              onClick={() =>{ 
                click_sound.play();
                setShowMemo(false);
              }}
              className="rounded-md bg-gray-200 px-2 py-1 text-sm hover:bg-gray-300"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoItem;