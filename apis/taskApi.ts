import axios from 'axios';
import { NextResponse } from 'next/server';

interface Task {
    title: string;
    description: string;
    priority: string;
    dueDate: string;
    user: string;
}

export const fetchTasks = async (currentUser: string) => {
  try {
    console.log("inside main taskApis")
    const res = await axios.post('/api/getTasks', {currentUser: currentUser});
    return res.data;
  } catch (error) {
      console.log("error while fetching tasks", error);
      return NextResponse.json({ message: "Failed to fetch tasks" }, { status: 500 });
    }
};

export const createTask = async (newTask: Task) => {
  try {
    // console.log("inside taskApi", newTask);
    const res = await axios.post('/api/tasks', newTask, { timeout: 5000 });
    return res.data;
  } catch (error) {
    console.log("error while creating task", error);
    return NextResponse.json({ message: "Failed to create task" }, { status: 500 });
  }
};

export const deleteTask = async (user: string, taskId: number) => {
  try {
    const res = await axios.delete('/api/tasks', { data: { user, taskId } });
    return res.data;
  } catch (error) {
    console.log("error while deleting task", error);
    return NextResponse.json({ message: "Failed to delete task" }, { status: 500 });
    
  }
};

export const updateTaskPriority = async (user: string, taskId:number, priority:string) => {
  try {
    const res = await axios.patch('/api/tasks', { user, taskId, priority }, { timeout: 5000 });
    return res.data;
  } catch (error) {
    throw new Error('Failed to update task priority');
  }
};

export const updateTaskStatus = async (user: string, taskId:number, status:string) => {
  try {
    const res = await axios.patch('/api/update-status', { user, taskId, status }, { timeout: 5000 });
    return res.data;
  } catch (error) {
    throw new Error('Failed to update task status');
  }
};


