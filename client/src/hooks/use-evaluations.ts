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

export function useUpdateEvaluationScore() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, manualScore }: { id: number, manualScore: number }) => {
      const res = await fetch(api.evaluations.updateScore.path.replace(":id", id.toString()), {
        method: api.evaluations.updateScore.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ manualScore }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update score");
      return api.evaluations.updateScore.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.evaluations.list.path] });
      toast({ title: "تم تحديث الدرجة", description: "تم تعديل الدرجة النهائية بنجاح" });
    },
    onError: () => {
      toast({ title: "خطأ", description: "حدث خطأ أثناء تحديث الدرجة", variant: "destructive" });
    }
  });
}
export function useCreateManualEvaluation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ teacherId, manualScore }: { teacherId: number, manualScore: number }) => {
      const res = await fetch(api.evaluations.createManual.path, {
        method: api.evaluations.createManual.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherId, manualScore }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create manual evaluation");
      return api.evaluations.createManual.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.evaluations.list.path] });
      toast({ title: "تم الحفظ", description: "تم تسجيل التقييم اليدوي بنجاح" });
    },
    onError: () => {
      toast({ title: "خطأ", description: "حدث خطأ أثناء الحفظ", variant: "destructive" });
    }
  });
}
