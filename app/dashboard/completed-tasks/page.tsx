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
import { CheckCircle2, EyeIcon, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useTaskStore } from "@/store/useTaskStore";
import { useUserStore } from "@/store/userStore";
import { useGetTasks } from "@/hook/useTask";
import { useEffect } from "react";
import { getSession } from "next-auth/react";
import { Task } from "../page";


export default function CompletedTasks() {

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
      const { data: tasks } = useGetTasks(user);
      const setTasks = useTaskStore((state) => state.setTasks);
      
      // Sync Zustand store when tasks are fetched
      useEffect(() => {
        if (tasks)  {
          setTasks(tasks);
        }
      }, [tasks, setTasks]);

      const completedTask = tasks && tasks?.filter((task: Task) => task.status === "completed");

      if(completedTask?.length === 0) {
        return (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">TaskMaster</span>
              </div>
              <div className="flex items-center space-x-2">
                <CardTitle>Completed Tasks</CardTitle>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle2 className="h-10 w-10 text-green-500" />
                <span className="text-lg font-semibold">No completed tasks</span>
              </div>
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
        <div className="flex items-center space-x-2">
          <CardTitle>Completed Tasks</CardTitle>
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Completed on</TableHead>
              
            </TableRow>
          </TableHeader>
          <TableBody>
            {completedTask?.map((task:Task) => (
              <TableRow key={task.id} className="mt-2">
                <TableCell>{task.title}</TableCell>
                <TableCell className="truncate w-60 line-clamp-1 h-[30px] text-ellipsis hover:whitespace-normal hover:h-auto hover:transition-transform cursor-pointer duration-500 hover:line-clamp-none">{task.description}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      task.priority === "high"
                        ? "bg-destructive/20 text-destructive"
                        : task.priority === "medium"
                        ? "bg-yellow-500/20 text-yellow-700"
                        : "bg-green-500/20 text-green-700"
                    }`}
                  >
                    {task.priority}
                  </span>
                </TableCell>
                <TableCell>{task.completedon}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}