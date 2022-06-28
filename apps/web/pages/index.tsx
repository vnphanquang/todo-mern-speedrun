import type { NextPage } from 'next'
import Head from 'next/head'
import React from 'react'
import debounce from 'lodash.debounce';
import { useModal } from 'react-hooks-async-modal';
import { TaskCategory } from '../enum/TaskCategory.enum';
import { ConfirmationModal, ConfirmationModalProps } from '../components/modals/ConfirmationModal';
import { TaskCategorySelect } from '../components/TaskCategorySelect';
import { Task } from '../types';
import { createTask, getAllTasks, updateTask, deleteTask as apiDeleteTask, setCompleted, randomizeTaskInput } from '../api/tasks';

const Home: NextPage = () => {
  const [name, setName] = React.useState('');
  const [category, setCategory] = React.useState<TaskCategory | ''>();
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [editMap, setEditMap] = React.useState<Record<number, boolean>>({});

  const callConfirmationModal = useModal<ConfirmationModalProps, boolean>(ConfirmationModal);

  React.useEffect(() => {
    const fetchTasks = async () => {
      const { data } = await getAllTasks();
      setTasks(data ?? []);
    };

    fetchTasks();
  }, []);

  React.useEffect(() => {
    const newEditMap = tasks.reduce((map, task) => {
      map[task.id] = editMap[task.id] ?? false;
      return map;
    } , {} as typeof editMap);
    setEditMap(newEditMap);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks]);

  const submit = React.useCallback(async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    const confirmed = await callConfirmationModal({ message: `Create task with name "${name}" in category "${category}"?` });
    if (confirmed) {
      const { data } = await createTask({ name, category: category as TaskCategory });
      setTasks([...tasks, data]);
      setName('');
      setCategory('');
    }
  }, [callConfirmationModal, name, category, tasks]);

  const onNameInput = React.useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setName((e.target as HTMLInputElement).value);
  }, []);

  const onCategoryChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value as typeof category);
  }, []);

  const randomize = React.useCallback(async () => {
    const { category, name } = await randomizeTaskInput();
    setCategory(category);
    setName(name);
  }, []);

  const editOrSaveTask = React.useCallback(async (task: Task) => {
    const { id, category, name } = task;
    if (editMap[id]) {
      // save
      const confirmed = await callConfirmationModal({ message: `Edit task to have name "${name}" in category "${category}"?` });
      if (confirmed) {
        await updateTask(id, { category, name });

        editMap[id] = false;
        setEditMap({ ...editMap, [id]: false });
      }
    } else {
      // set edit mode
      setEditMap({ ...editMap, [id]: true });
    }
  }, [callConfirmationModal, editMap]);

  const deleteTask = React.useCallback(async (task: Task) => {
    const { category, name, id } = task;
    const confirmed = await callConfirmationModal({ message: `Delete task with name "${name}" in category "${category}"?` });
    if (confirmed) {
      await apiDeleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
    }
    // delete
  }, [callConfirmationModal, tasks]);

  const debouncedToggleCompleted = React.useRef(debounce((id: number, completed: boolean) => {
    return setCompleted(id, completed);
  }, 250));
  const toggleCompleted = React.useCallback((id: number) => {
    let completed = false;
    for (const task of tasks) {
      if (task.id === id) {
        completed = !task.completed;
        task.completed = completed;
      }
    }
    setTasks([...tasks]);
    debouncedToggleCompleted.current(id, completed);
  }, [tasks]);

  const onTaskCategoryChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>, id: number) => {
    const value = (e.target as HTMLSelectElement).value as TaskCategory;
    setTasks(tasks.map(task => {
      if (task.id === id) {
        task.category = value;
      }
      return task;
    }));
  }, [tasks]);

  const onTaskNameInput = React.useCallback((e: React.FormEvent<HTMLInputElement>, id: number) => {
    const value = (e.target as HTMLInputElement).value;
    setTasks(tasks.map(task => {
      if (task.id === id) {
        task.name = value;
      }
      return task;
    }));
  }, [tasks]);

  return (
    <div className="p-10">
      <Head>
        <title>Todo</title>
        <meta name="description" content="Speedrun Todo MERN" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="grid gap-10 grid-cols-1 md:grid-cols-[minmax(40%,auto),1fr] items-start">
        <section className="border-2 border-orange-400 p-6">
          <h2 className="text-2xl mb-8 font-bold">Todo Task</h2>
          <form onSubmit={submit} className="flex flex-col gap-y-10" >
            <div className="form-control">
              <label htmlFor="name" className="label-text font-bold">Task</label>
              <input
                className="input input-bordered"
                type="text"
                name="name"
                id="name"
                required
                value={name}
                onInput={onNameInput}
                placeholder="Task name"
              />
            </div>
            <div className="form-control">
              <label htmlFor="category" className="label-text font-bold">Category</label>
              <TaskCategorySelect
                value={category}
                onChange={onCategoryChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-x-10 pt-2 w-full">
              <button className="btn btn-outline" type="button" onClick={randomize}>Random</button>
              <button className="btn btn-primary" type="submit">Submit</button>
            </div>
          </form>
        </section>

        <section className="border-2 border-orange-400 p-6">
          <ul className="flex flex-col gap-y-4">
            {tasks.map(task => (
              <li
                key={task.id}
                className={`grid grid-cols-[auto,minmax(auto,1fr),auto,auto] gap-4 items-center border ${task.completed ? 'border-primary' : 'border-gray-500'} rounded-md px-4 h-24`}
              >
                <input type="checkbox" className="checkbox checkbox-primary checkbox-lg" checked={task.completed} onChange={() => toggleCompleted(task.id)} />
                <div className="text-sm">
                  {editMap[task.id] ? (
                    <>
                      <TaskCategorySelect
                        className="select-xs w-full"
                        value={task.category}
                        onChange={(e) => onTaskCategoryChange(e, task.id)}
                      />
                      <input
                        className="input input-xs input-bordered mt-2 w-full"
                        value={task.name}
                        onInput={(e) => onTaskNameInput(e, task.id)}
                      />
                    </>
                  ) : (
                    <>
                      <p className="italic font-bold">{task.category.charAt(0).toUpperCase() + task.category.slice(1)}</p>
                      <p>{task.name}</p>
                    </>
                  )}
                </div>

                <button type="button" onClick={() => editOrSaveTask(task)}>
                  {editMap[task.id] ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" height="30" width="30"><path d="M42 13.85V39q0 1.2-.9 2.1-.9.9-2.1.9H9q-1.2 0-2.1-.9Q6 40.2 6 39V9q0-1.2.9-2.1Q7.8 6 9 6h25.15Zm-3 1.35L32.8 9H9v30h30ZM24 35.75q2.15 0 3.675-1.525T29.2 30.55q0-2.15-1.525-3.675T24 25.35q-2.15 0-3.675 1.525T18.8 30.55q0 2.15 1.525 3.675T24 35.75ZM11.65 18.8h17.9v-7.15h-17.9ZM9 15.2V39 9Z"/></svg>
                    ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" height="30" width="30"><path d="M9 39h2.2l22.15-22.15-2.2-2.2L9 36.8Zm30.7-24.3-6.4-6.4 2.1-2.1q.85-.85 2.1-.85t2.1.85l2.2 2.2q.85.85.85 2.1t-.85 2.1Zm-2.1 2.1L12.4 42H6v-6.4l25.2-25.2Zm-5.35-1.05-1.1-1.1 2.2 2.2Z"/></svg>
                  )}
                </button>

                <button className="" type="button" onClick={() => deleteTask(task)}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" height="30" width="30"><path d="M13.05 42q-1.2 0-2.1-.9-.9-.9-.9-2.1V10.5H8v-3h9.4V6h13.2v1.5H40v3h-2.05V39q0 1.2-.9 2.1-.9.9-2.1.9Zm21.9-31.5h-21.9V39h21.9Zm-16.6 24.2h3V14.75h-3Zm8.3 0h3V14.75h-3Zm-13.6-24.2V39Z"/></svg>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}

export default Home
