import { Task } from "@/app/dashboard/page";
import {create} from "zustand";

interface TaskStore {
    tasks: Task[];
    setTasks: (tasks: Task[]) => void;
    removeTask: (taskId: number) => void;
    addTask: (task: Task) => void;
    updateTask: (taskId: number) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
    tasks: [],
    setTasks: (tasks: Task[]) => set({ tasks }),
    removeTask: (taskId: number) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
        })),
    addTask: (task: Task) => set((state) => ({  tasks: [...state.tasks, task] })),
    updateTask: (taskId: number) => set((state) => ({
        tasks: state.tasks.map((task) => {
          if (task.id === taskId) {
            return { ...task, status: "completed" };
          }
          return task;
        }),
      })),
}));
