import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type InsertSchool } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useSchools() {
  return useQuery({
    queryKey: [api.schools.list.path],
    queryFn: async () => {
      const res = await fetch(api.schools.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch schools");
      return api.schools.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateSchool() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertSchool) => {
      const res = await fetch(api.schools.create.path, {
        method: api.schools.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create school");
      return api.schools.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.schools.list.path] });
      toast({ title: "نجاح", description: "تم إضافة المدرسة بنجاح" });
    },
    onError: () => {
      toast({ title: "خطأ", description: "لم يتم إضافة المدرسة", variant: "destructive" });
    }
  });
}

export function useDeleteSchool() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/schools/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete school");
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.schools.list.path] });
      toast({ title: "نجاح", description: "تم حذف المدرسة بنجاح" });
    },
    onError: () => {
      toast({ title: "خطأ", description: "فشل في حذف المدرسة", variant: "destructive" });
    }
  });
}
