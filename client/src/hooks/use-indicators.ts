import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertIndicator } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useIndicators() {
  return useQuery({
    queryKey: [api.indicators.list.path],
    queryFn: async () => {
      const res = await fetch(api.indicators.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch indicators");
      return api.indicators.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateIndicator() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertIndicator) => {
      const res = await fetch(api.indicators.create.path, {
        method: api.indicators.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create indicator");
      return api.indicators.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.indicators.list.path] });
      toast({ title: "نجاح", description: "تم رفع المؤشر بنجاح" });
    },
  });
}

export function useApproveIndicator() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.indicators.approve.path, { id });
      const res = await fetch(url, {
        method: api.indicators.approve.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to approve indicator");
      return api.indicators.approve.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.indicators.list.path] });
      toast({ title: "نجاح", description: "تم اعتماد المؤشر" });
    },
  });
}
