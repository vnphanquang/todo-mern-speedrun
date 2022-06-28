import { TaskCategory } from "../enum/TaskCategory.enum";

export interface Task {
  id: number;
  name: string;
  category: TaskCategory;
  completed: boolean;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
}
