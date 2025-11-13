import { useState, useEffect } from "react"; // ◀◀ 追加
import type { Todo } from "./types";
import WelcomeMessage from "./WelcomeMessage";
import TodoList from "./TodoList";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge"; // ◀◀ 追加
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // ◀◀ 追加
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"; // ◀◀ 追加
import { sortTodos_isdone } from "./sortTodos";
import { sortTodos_limit } from "./sortTodos";
import { sortTodos_all } from "./sortTodos";
import createsound from "./sound/create.mp3";
import deletesound from "./sound/delete.mp3";
import clicksound from "./sound/click.mp3";
import { CircleFill } from "./CircleFill"; 




const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoName, setNewTodoName] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState("あっかーん!☠");
  const [newTodoDeadline, setNewTodoDeadline] = useState<Date | null>(null);
  const [newTodoNameError, setNewTodoNameError] = useState("");
  const [initialized, setInitialized] = useState(false); // ◀◀ 追加
  const localStorageKey = "TodoApp"; // ◀◀ 追加
  const [user_LV, setUserLV] = useState(1); // ← これが「状態」
  const [LVexp, setLVexp] = useState(0);
  const [LV_limit, setLV_limit] = useState(50);
  const [Exp_per, setExp_per] = useState(0);
  

  useEffect(() => {
  const todoJsonStr = localStorage.getItem(localStorageKey);
  if (todoJsonStr && todoJsonStr !== "[]") {
    const storedData: { todos?: Todo[]; userLV?: number; LVexp?: number; LV_limit?: number; Exp_per : number } | Todo[] = JSON.parse(todoJsonStr);


    if (!Array.isArray(storedData) && storedData.todos) {
      const convertedTodos: Todo[] = storedData.todos.map((todo) => ({
        ...todo,
        deadline: todo.deadline ? new Date(todo.deadline) : null,
      }));
      setTodos(convertedTodos);
      setUserLV(storedData.userLV ?? 1);
      setLVexp(storedData.LVexp ?? 0);
      setLV_limit(storedData.LV_limit ?? 50);
      setExp_per(storedData.Exp_per ?? 0);
      
    } 
    else if (Array.isArray(storedData)) {
      const convertedTodos: Todo[] = storedData.map((todo) => ({
        ...todo,
        deadline: todo.deadline ? new Date(todo.deadline) : null,
      }));
      setTodos(convertedTodos);
    }
  }
  setInitialized(true);
}, []);


  useEffect(() => {
    if (!initialized) return; 

    const dataToSave = {
      todos,
      userLV: user_LV,
      LVexp,
      LV_limit,
      Exp_per
    };
    localStorage.setItem(localStorageKey, JSON.stringify(dataToSave));
  }, [todos, user_LV, LVexp, LV_limit, initialized,Exp_per]);

  const uncompletedCount = todos.filter((todo: Todo) => !todo.isDone).length;

  // ▼▼ 追加
  const isValidTodoName = (name: string): string => {
    if (name.length < 2 || name.length > 32) {
      return "2文字以上、32文字以内で入力してください";
    } else {
      return "";
    }
  };

  const updateNewTodoName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoNameError(isValidTodoName(e.target.value)); // ◀◀ 追加
    setNewTodoName(e.target.value);
  };



  const updateDeadline = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dt = e.target.value; // UIで日時が未設定のときは空文字列 "" が dt に格納される
    console.log(`UI操作で日時が "${dt}" (${typeof dt}型) に変更されました。`);
    setNewTodoDeadline(dt === "" ? null : new Date(dt));
  };

  const addNewTodo = () => {
    // ▼▼ 編集
    const err = isValidTodoName(newTodoName);
    if (err !== "") {
      setNewTodoNameError(err);
      return;
    }
    const newTodo: Todo = {
      id: uuid(),
      name: newTodoName,
      isDone: false,
      priority: newTodoPriority,
      deadline: newTodoDeadline,
      memo:"",
      exp : 0,
      subTodos: [] // ← これを追加！
    };
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    setNewTodoName("");
    setNewTodoPriority("あっかーん!☠");
    setNewTodoDeadline(null);
  };

  const updateMemo = (id : string, newMemo: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
      todo.id === id ? {...todo,memo: newMemo} : todo
  )
);
  };

  const updateIsDone = (id: string, value: boolean) => {
  const updatedTodos = todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, isDone: value }; // スプレッド構文
    } else {
      return todo;
    }
  });
  setTodos(updatedTodos);
};

const delete_sound = new Audio(deletesound)
const create_sound = new Audio(createsound)
const click_sound = new Audio(clicksound)


const removeCompletedTodos = () => {
  const comptodos = todos.filter((todo) => todo.isDone)
  const gainedexp = comptodos.reduce((sum,todo) => sum + (todo.exp || 0),0);
   let exp = LVexp + gainedexp;
  let level = user_LV;
  let limit = LV_limit;

  while (exp >= limit) {
    exp -= limit;
    level++;
    limit += 50;
  }

  setLVexp(exp);
  setLV_limit(limit);
  setUserLV(level);

   setExp_per(exp / limit);

  const updatedTodos = todos.filter((todo) => !todo.isDone);
  setTodos(updatedTodos);
  console.log(`Lv:${level}, 残EXP:${exp}, 次Lv必要:${limit}`);
  delete_sound.play();
};


const removeCompletedSubTodos = (parentId: string) => {
  setTodos(prev =>
    prev.map(todo =>
      todo.id === parentId
        ? {
            ...todo,
            subTodos: todo.subTodos.filter(sub => !sub.isDone), 
          }
        : todo
    )
  );
};



const remove = (id: string) => {
  const target = todos.find(todo => todo.id === id);
  if (target === undefined){
    return;
  }
  if (target.isDone === true){
    let exp = LVexp + target.exp;
  let level = user_LV;
  let limit = LV_limit;

  while (exp >= limit) {
    exp -= limit;
    level++;
    limit += 50;
  }


  setLVexp(exp);
  setLV_limit(limit);
  setUserLV(level);
  setExp_per(exp / limit);
  }
  

  const updatedTodos = todos.filter((todo) => todo.id !== id);
  setTodos(updatedTodos);
};


function addSubTodo(parentId: string, name: string) {
  setTodos((prev) =>
    prev.map((todo) =>
      todo.id === parentId
        ? {
            ...todo,
            subTodos: [
              ...(todo.subTodos || []),
              {
                id: crypto.randomUUID(),
                name,
                memo: "",       
                isDone: false,  
              },
            ],
          }
        : todo
    )
  );
}


function removeSubTodo(parentId: string, subId: string) {
  setTodos((prev) =>
    prev.map((todo) =>
      todo.id === parentId
        ? {
            ...todo,
            subTodos: todo.subTodos?.filter((s) => s.id !== subId),
          }
        : todo
    )
  );
}

function updateSubIsDone(parentId: string, subId: string) {
  setTodos((prev) =>
    prev.map((todo) =>
      todo.id === parentId
        ? {
            ...todo,
            subTodos: todo.subTodos?.map((s) =>
              s.id === subId ? { ...s, isDone: !s.isDone } : s
            ),
          }
        : todo
    )
  );
}



  return (
    <div className="mx-4 mt-10 max-w-2xl md:mx-auto">
      <h1 className="mb-4 text-4xl font-bold text-center">やるべきことリスト</h1>
      <div className="mb-4">
        <WelcomeMessage
          name="コッツァ"
          uncompletedCount={uncompletedCount}
        />
      </div>
      <div className="mb-4 space-x-2">
        <button
        type = "button"
        onClick = {() => {
          const sorted = sortTodos_isdone(todos);
          click_sound.play();
          setTodos(sorted); 
        }}
        className = "rounded-lg bg-gray-300 px-1 py-1 font-bold text-sx text-black hover:bg-gray-400"
        >
        完了済みでソート≡↯
        </button>
        <button
        type = "button"
        onClick = {() => {
          const sorted = sortTodos_limit(todos);
          click_sound.play();
          setTodos(sorted); 
        }}
        className = "rounded-lg bg-gray-300 px-1 py-1 font-bold text-sx text-black hover:bg-gray-400"
        >
        期限順でソート≡↯
        </button>
        <button
        type = "button"
        onClick = {() => {
          const sorted = sortTodos_all(todos);
          click_sound.play();
          setTodos(sorted); 
        }}
        className = "rounded-lg bg-gray-300 px-1 py-1 font-bold text-sx text-black hover:bg-gray-400"
        >
        両方でソート≡↯
        </button>
      </div>
      <TodoList todos={todos} updateIsDone={updateIsDone} remove={remove} updateMemo={updateMemo} 
      updateSubIsDone={updateSubIsDone} addSubTodo={addSubTodo} removeSubTodo={removeSubTodo}removeCompletedSubTodos={removeCompletedSubTodos}/>

      <div className="mt-5 space-y-2 rounded-md border p-3">
        <h2 className="text-lg font-bold">新しいタスクを追加しよう!</h2>
        <div>
          <div className="flex items-center space-x-2">
            <label className="font-bold" htmlFor="newTodoName">
              名前
            </label>
            <input
              id="newTodoName"
              type="text"
              value={newTodoName}
              onChange={updateNewTodoName}
              className={twMerge(
                "grow rounded-md border p-2",
                newTodoNameError && "border-red-500 outline-red-500"
              )}
              placeholder="2文字以上、32文字以内で入力してください"
            />
          </div>
          {newTodoNameError && (
            <div className="ml-10 flex items-center space-x-1 text-sm font-bold text-red-500">
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                className="mr-0.5"
              />
              <div>{newTodoNameError}</div>
            </div>
          )}
        </div>

        <div className="flex gap-5">
          <div className="font-bold">優先度</div>
          {["やばいかも..🤔", "やばいッ🙃", "あっかーん!☠"].map((value) => (
            <label key={value} className="flex items-center space-x-1">
              <input
                id={`priority-${value}`}
                name="priorityGroup"
                type="radio"
                value={value}
                checked={newTodoPriority === value}
                onChange={(e) => setNewTodoPriority(e.target.value)}
              />
              <span>{value}</span>
            </label>
          ))}
        </div>

        <div className="flex items-center gap-x-2">
          <label htmlFor="deadline" className="font-bold">
            期限
          </label>
          <input
            type="datetime-local"
            id="deadline"
            value={
              newTodoDeadline
                ? dayjs(newTodoDeadline).format("YYYY-MM-DDTHH:mm:ss")
                : ""
            }
            onChange={updateDeadline}
            className="rounded-md border border-gray-400 px-2 py-0.5"
          />
        </div>

        <div className = "space-x-2">
        <button
          type="button"
          onClick={() => {
            create_sound.play();
            addNewTodo()}
          }
          className={twMerge(
            "rounded-md bg-indigo-500 px-3 py-1 font-bold text-white hover:bg-indigo-600",
            newTodoNameError && "cursor-not-allowed opacity-50"
          )}
        >
          追加!
        </button>

        <button
  type="button"
  onClick={() => {

    removeCompletedTodos();

  }}
  className={
    "mt-5 rounded-md bg-red-500 px-3 py-1 font-bold text-white hover:bg-red-600"
  }
>
  完了済みのタスクを削除!
</button>
</div>
<div className="fixed top-4 right-4 z-50 flex flex-col items-center space-y-1 rounded-full bg-indigo-400 w-24 h-28 p-3 text-white">
  <CircleFill LVexp={Exp_per} />
  <span className="text-sm font-bold">LV.{user_LV}</span>
</div>
      </div>
      </div>
  );
};

export default App;