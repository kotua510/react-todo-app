export type Todo = {
  id: string;
  name: string;
  isDone: boolean;
  priority: string;
  deadline: Date | null;
  memo: string;
  exp: number;
  subTodos : SubTodo[];
};

export type SubTodo = {
  id : string;
  name : string;
  memo : string;
  isDone : boolean
}