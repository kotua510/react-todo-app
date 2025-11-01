import type { Todo } from "./types";
import { v4 as uuid } from "uuid"; // v4 を uuid という名前でインポート

export const initTodos: Todo[] = [
  {
    id: uuid(), // UUID v4 を生成してIDにセット
    name: "楽しむ",
    isDone: false,
    priority: 2,
    deadline: new Date(2024, 10, 11, 17, 30),
  },
  {
    id: uuid(),
    name: "生きる",
    isDone: false,
    priority: 3,
    deadline: null, // このTodoには期限を設定しない
  },
  {
    id: uuid(),
    name: "休む",
    isDone: false,
    priority: 1,
    deadline: new Date(2024, 10, 19),
  },
];