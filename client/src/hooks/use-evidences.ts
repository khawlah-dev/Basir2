import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertEvidence } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useEvidences() {
  return useQuery({
    queryKey: [api.evidences.list.path],
    queryFn: async () => {
      const res = await fetch(api.evidences.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch evidences");
      return api.evidences.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateEvidence() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertEvidence) => {
      const res = await fetch(api.evidences.create.path, {
        method: api.evidences.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to create evidence");
      }
      return api.evidences.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.evidences.list.path] });
      toast({ title: "نجاح", description: "تم رفع الشاهد بنجاح" });
    },
  });
}

export function useApproveEvidence() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.evidences.approve.path, { id });
      const res = await fetch(url, {
        method: api.evidences.approve.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to approve evidence");
      return api.evidences.approve.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.evidences.list.path] });
      toast({ title: "نجاح", description: "تم اعتماد الشاهد" });
    },
  });
}

export function useUpdateEvidence() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertEvidence> }) => {
      const url = buildUrl(api.evidences.update.path, { id });
      const res = await fetch(url, {
        method: api.evidences.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to update evidence");
      }
      return api.evidences.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.evidences.list.path] });
      toast({ title: "نجاح", description: "تم تحديث الشاهد بنجاح" });
    },
  });
}

export function useDeleteEvidence() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.evidences.delete.path, { id });
      const res = await fetch(url, {
        method: api.evidences.delete.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete evidence");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.evidences.list.path] });
      toast({ title: "نجاح", description: "تم حذف الشاهد بنجاح" });
    },
  });
}
