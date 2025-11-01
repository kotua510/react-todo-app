export type Todo = {
  id: string;
  name: string;
  isDone: boolean;
  priority: string;
  deadline: Date | null; // 注意
};