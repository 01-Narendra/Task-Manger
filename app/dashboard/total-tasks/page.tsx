"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2, EyeIcon, Loader2, MoreHorizontal, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetTasks } from "@/hook/useTask";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { Task } from "../page";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { set } from "date-fns";
import { deleteTask, updateTaskPriority, updateTaskStatus } from "@/apis/taskApi";
import { useTaskStore } from "@/store/useTaskStore";
import { useUserStore } from "@/store/userStore";


const priorityMap = {
  low: ["medium", "high"],
  medium: ["low", "high"],
  high: ["low", "medium"],
};

const statusMap = {
  pending: ["completed"],
  completed: ["pending"],
};

export default function TotalTasks() {

  const setUser = useUserStore((state) => state.setUser);
  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session) {
        setUser(session.user?.email || "No email found");
      }
    };
    fetchSession();
  }, []);

  const user = useUserStore((state) => state.user);

  // fetching all the tasks
  const { data: tasks, isLoading } = useGetTasks(user);
  const setTasks = useTaskStore((state) => state.setTasks);
  const removeTask = useTaskStore((state) => state.removeTask);
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);

  const getTasks = (tasks: Task[]): Task[] => {
    if(tasks?.length === 0 || !tasks) {
      return [];
    }
    return tasks
      .filter((task:Task) => task.dueDate)
      .sort((a:Task, b:Task) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
  };

  const tasksSorted = getTasks(tasks)

  // updating task priority
  const [isPending, setIsPending] = useState({ status: false, taskId: 0 });
  const handleUpdatePriority = async(value: string, id: number) => {
    setIsPending({ status: true, taskId: id });
    try {
      const response = await updateTaskPriority(user, id, value);
      console.log("response", response);
    } catch (error) {
      console.log("error while updating priority", error);
    } finally {
      setIsPending({
        status: false,
        taskId: 0
      });
    }
  }

  // updating task status
  const [isPendingStatus, setIsPendingStatus] = useState(false)
  const handleStatusChange = async(value: string, id: number) => {
    setIsPendingStatus(true);
    try {
      updateTask(id);
      const response = await updateTaskStatus(user, id, value);
      console.log("response", response);
    } catch (error) {
      console.log("error while updating status", error);
    } finally {
      setIsPendingStatus(false);
    }
  }

  // deleting task
  const [isPendingDelete, setIsPendingDelete] = useState({ status: false, taskId: 0 });
  const handleDeleteTask = async(id: number) => {
    setIsPendingDelete({ status: true, taskId: id });
    try {
      removeTask(id);
      const response = await deleteTask(user, id);
      tasksSorted?.filter((task: Task) => task.id !== id);
      console.log("response", response);
    } catch (error) {
      console.log("error while deleting task", error);
      addTask(tasks?.find((task: Task) => task.id === id));
    } finally {
      setIsPendingDelete({ status: false, taskId: 0 });
    }
  }

  // Sync Zustand store when tasks are fetched
  useEffect(() => {
    if (tasks)  {
      setTasks(tasks);
    }
  }, [tasks, setTasks, removeTask, isPendingDelete.taskId]);

  if(isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">TaskMaster</span>
          </div>
        </CardHeader>
        <CardContent>
          <CardTitle>Loading...</CardTitle>
        </CardContent>
      </Card>
    );
  }


  if(tasks?.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">TaskMaster</span>
          </div>
        </CardHeader>
        <CardContent>
          <CardTitle>No tasks found</CardTitle>
        </CardContent>
      </Card>
    );
  }


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">TaskMaster</span>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasksSorted?.map((task:Task) => (
              <TableRow key={task.id} className={`${isPendingDelete.taskId === task.id ? 'animate-pulse' : ''} mt-2`}>
                <TableCell>{task.title}</TableCell>
                <TableCell className="truncate w-52 line-clamp-1 h-[30px] mt-2 text-ellipsis hover:whitespace-normal hover:h-auto hover:transition-transform cursor-pointer duration-500 hover:line-clamp-none">{task.description}</TableCell>
                <TableCell>
                <Select onValueChange={(value) => task.id !== undefined && handleUpdatePriority(value, task.id)}>
                  <SelectTrigger className="w-[110px] border-none">
                    <SelectValue placeholder={task.priority.charAt(0).toUpperCase()+task.priority.slice(1)} />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityMap[task.priority]?.map((value) => (
                      <SelectItem key={value} value={value}>
                        {isPending.status ? "updating..." : value.charAt(0).toUpperCase() + value.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                  
                </TableCell>
                <TableCell>{task.dueDate}</TableCell>
                <TableCell>
                <Select onValueChange={(value) => task.id !== undefined && handleStatusChange(value, task.id)}>
                  <SelectTrigger className="w-[120px] border-none">
                    <SelectValue placeholder={task.status.charAt(0).toUpperCase() + task.status.slice(1)} />
                  </SelectTrigger>
                  <SelectContent>
                    {statusMap[task.status]?.map((value) => (
                      <SelectItem key={value} value={value}>
                        {isPendingStatus ? "updating..." : value.charAt(0).toUpperCase() + value.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => task.id !== undefined && handleDeleteTask(task.id)} className="text-destructive">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}