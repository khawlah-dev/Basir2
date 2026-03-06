import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type InsertFlag } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useFlags() {
  return useQuery({
    queryKey: [api.flags.list.path],
    queryFn: async () => {
      const res = await fetch(api.flags.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch flags");
      return api.flags.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateFlag() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertFlag) => {
      const res = await fetch(api.flags.create.path, {
        method: api.flags.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create flag");
      return api.flags.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.flags.list.path] });
      toast({ title: "نجاح", description: "تم إضافة الملاحظة بنجاح" });
    },
  });
}

export function useDeleteFlag() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/flags/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete flag");
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.flags.list.path] });
      toast({ title: "نجاح", description: "تم حذف الملاحظة بنجاح" });
    },
    onError: () => {
      toast({ title: "خطأ", description: "فشل في حذف الملاحظة", variant: "destructive" });
    }
  });
}
