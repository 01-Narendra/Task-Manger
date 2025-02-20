import { createTask, deleteTask, fetchTasks, updateTaskPriority, updateTaskStatus } from '@/apis/taskApi';
import { useTaskStore } from '@/store/useTaskStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

console.log("inside main hook")
export const useGetTasks = (currentUser: string) => 
  useQuery({
    queryKey: ['tasks', currentUser],
    queryFn: () => fetchTasks(currentUser),
    
  });


export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
    onError: (error: any) => console.error('Error creating task:', error),
  });
};

export const useDeleteTask = (user: string, taskId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteTask(user, taskId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
    onError: (error: any) => console.error('Error deleting task:', error),
  });
};


export const useUpdateTaskPriority = (user: string, taskId: number, priority: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => updateTaskPriority(user, taskId, priority),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
    onError: (error) => console.error('Error updating priority:', error),
  });
};

export const useUpdateTaskStatus = (user: string, taskId: number, status: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => updateTaskStatus(user, taskId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
    onError: (error: any) => console.error('Error updating status:', error),
  });
}