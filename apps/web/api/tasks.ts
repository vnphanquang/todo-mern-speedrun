import Axios from 'axios';
import { TaskCategory } from '../enum/TaskCategory.enum';
import { Task } from '../types';

const BACKEND_URL = 'http://localhost:3001';

export function getAllTasks() {
  return Axios.get<Task[]>(`${BACKEND_URL}/tasks`);
}

export function createTask(task: Pick<Task, 'name' | 'category'>) {
  return Axios.post<Task>(`${BACKEND_URL}/tasks`, task);
}

export function updateTask(id: number, task: Pick<Task, 'name' | 'category'>) {
  return Axios.patch<Task>(`${BACKEND_URL}/tasks/${id}`, task);
}

export function deleteTask(id: number) {
  return Axios.delete<Task>(`${BACKEND_URL}/tasks/${id}`);
}

export function setCompleted(id: number, completed: boolean) {
  return Axios.patch<Task>(`${BACKEND_URL}/tasks/${id}`, { completed });
}

type RandomizedActivity = {
  activity: string;
  type: TaskCategory;
  participants: number;
  price: number;
  link: string;
  key: string;
  accessibility: number;
}
export async function randomizeTaskInput() {
  const categories = Object.keys(TaskCategory);
  const category = categories[Math.floor(Math.random() * categories.length)];
  const { data } = await Axios.get<RandomizedActivity>(`http://www.boredapi.com/api/activity?type=${category}`);
  return {
    category,
    name: data.activity
  };
}
