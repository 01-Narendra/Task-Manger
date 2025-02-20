"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useCreateTask, useGetTasks } from "@/hook/useTask";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Badge,
  CheckCircle2,
  Clock,
  Layout,
  List,
  Plus,
  Search,
} from "lucide-react";
import { getSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import timer from '../../public/hourglass.gif'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { z } from "zod";
import { useUserStore } from "@/store/userStore";
import { useTaskStore } from "@/store/useTaskStore";

import { cn } from "@/lib/utils";

const data = [
  { name: "Mon", tasks: 4 },
  { name: "Tue", tasks: 6 },
  { name: "Wed", tasks: 8 },
  { name: "Thu", tasks: 5 },
  { name: "Fri", tasks: 7 },
  { name: "Sat", tasks: 3 },
  { name: "Sun", tasks: 2 },
];


const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z
    .date({
      required_error: "Due date is required",
    })
    .refine((date) => date >= new Date(new Date().setHours(0, 0, 0, 0)), {
      message: "Due date cannot be in the past",
    }),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

export type Task = {
  id?: number;
  status: "pending" | "completed";
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
  user?: string;
  completedon?: string;
};

export default function Dashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  
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

    const completedTask = tasks && tasks?.filter((task:Task) => task.status === "completed");
    const totalTasks = tasks?.length;
    const completedTaskLength = completedTask?.length;

    const getTopSevenTasks = (tasks: Task[]): Task[] => {
      if (tasks?.length === 0 || !tasks) {
        return [];
      }
      return tasks
        .filter((task) => task.dueDate && task.status === "pending") // Ensure tasks have a due date
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) // Sort by dueDate ascending
        .slice(0, 7); 
    };

    const getCompletedTasksByDay = (tasks: Task[]) => {
      const dayMap: Record<string, string> = {
        Sunday: "Sun",
        Monday: "Mon",
        Tuesday: "Tue",
        Wednesday: "Wed",
        Thursday: "Thu",
        Friday: "Fri",
        Saturday: "Sat",
      };
    
      // Initialize all days with 0 tasks
      const result: { name: string; tasks: number }[] = Object.values(dayMap).map((day) => ({
        name: day,
        tasks: 0,
      }));
    
      // Count tasks per day
      const taskCount = tasks.reduce((acc: Record<string, number>, task) => {
        if (task.completedon) {
          const day = new Date(task.completedon).toLocaleDateString("en-US", { weekday: "long" });
          const shortDay = dayMap[day];
          acc[shortDay] = (acc[shortDay] || 0) + 1;
        }
        return acc;
      }, {});
    
      // Update task count in result
      return result.map((entry) => ({
        name: entry.name,
        tasks: taskCount[entry.name] || 0,
      }));
    };

    const graphData = getCompletedTasksByDay(completedTask || []);
    // console.log("graphData", graphData)
    
    const upcomingTasks = getTopSevenTasks(tasks || []);
    const scheduledDates = tasks?.map((task:Task) => new Date(task.dueDate));


  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
    },
  });

  const createTaskMutation = useCreateTask()
  const {toast} = useToast()

  const onSubmit = async (data: TaskFormValues) => {
    try {
      // console.log("Form submitted:", data);
      console.log("User:", user)
      const datedss = data.dueDate.toISOString().split('T')[0];
      // console.log("datedss", datedss)
      
      const response = await createTaskMutation.mutateAsync({
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: datedss,
        user: user,
      });

      toast({
        title: "Task created",
        description: response.message,
      })

      setIsAddTaskOpen(false);
      form.reset();
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  return (
    <div className="bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">TaskMaster</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tasks..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[425px] md:max-w-5xl">
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                    <DialogDescription>
                      Add a new task to your project. Fill in the details below.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 grid md:grid-cols-2 grid-cols-1">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem className="w-[80%]">
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter task title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem className="w-[80%]">
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter task description"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem className="w-[80%]">
                            <FormLabel>Priority</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                          <FormItem className="w-[80%]">
                            <FormLabel>Due Date</FormLabel>
                            <FormControl>
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  if (date) {
                                    // Fix timezone issue by normalizing the date to UTC midnight
                                    const normalizedDate = new Date(
                                      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
                                    );
                                    field.onChange(normalizedDate);
                                  }
                                }}
                                className="rounded-md border"
                                disabled={(date) =>
                                  date < new Date(new Date().setHours(0, 0, 0, 0)) // Prevent past date selection
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex ml-[155%] space-x-4 pt-4">
                        <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddTaskOpen(false)}
                        >
                        Cancel
                        </Button>
                        <Button disabled={createTaskMutation.isPending} type="submit">
                        {createTaskMutation.isPending ? 'Creating...' : 'Create Task'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className=" px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Task Overview Card */}
          <Card>
            <CardHeader className="flex flex-row cursor-pointer items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <List className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTasks || 0}</div>
              <Progress value={100} className="mt-4" />
            </CardContent>
          </Card>

          {/* Completed Tasks Card */}
          <Card>
            <CardHeader className="flex flex-row cursor-pointer items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completed Tasks
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedTaskLength || 0}</div>
              <Progress value={(completedTaskLength/totalTasks)*100} className="mt-4" />
            </CardContent>
          </Card>

          {/* Active Projects Card */}
          
            <Image
            src={timer}
            alt="Timer"
            className="w-36 h-36 flex ml-[30%]"
            />
          
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Task Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Task Activity</CardTitle>
              <CardDescription>Your task completion over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={graphData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="tasks"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Calendar View */}
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>View your scheduled tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                modifiers={{
                  scheduled: scheduledDates,
                }}
                modifiersClassNames={{
                  scheduled: "border border-black rounded-full", // Custom styling for marked dates
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Tasks */}
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
              <CardDescription>Tasks due in the next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                {upcomingTasks.length == 0 && 'No Upcoming Tasks Chill out'}
                <TabsContent value="all">
                  <div className="space-y-4">
                    {upcomingTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            • Due {task.dueDate}
                          </p>
                        </div>
                        <div
                          className={`px-2 py-1 rounded text-xs ${
                            task.priority === "high"
                              ? "bg-destructive/20 text-destructive"
                              : task.priority === "medium"
                              ? "bg-yellow-500/20 text-yellow-700"
                              : "bg-green-500/20 text-green-700"
                          }`}
                        >
                          {task.priority}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}