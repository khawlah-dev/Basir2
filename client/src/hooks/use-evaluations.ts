import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useEvaluations() {
  return useQuery({
    queryKey: [api.evaluations.list.path],
    queryFn: async () => {
      const res = await fetch(api.evaluations.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch evaluations");
      return api.evaluations.list.responses[200].parse(await res.json());
    },
  });
}

export function useStartEvaluation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (teacherId: number) => {
      const res = await fetch(api.evaluations.start.path, {
        method: api.evaluations.start.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherId }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to start evaluation");
      return api.evaluations.start.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.evaluations.list.path] });
      toast({ title: "اكتمل التقييم", description: "تم إنشاء التقييم بنجاح بواسطة الذكاء الاصطناعي" });
    },
    onError: () => {
      toast({ title: "خطأ", description: "حدث خطأ أثناء التقييم", variant: "destructive" });
    }
  });
}
