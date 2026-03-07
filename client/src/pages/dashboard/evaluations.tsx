import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useEvaluations, useStartEvaluation } from "@/hooks/use-evaluations";
import { useUsers } from "@/hooks/use-users";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Bot, Star, Award } from "lucide-react";
import ReactMarkdown from "react-markdown";

export function EvaluationsManager() {
  const { data: user } = useAuth();
  const { data: evals, isLoading } = useEvaluations();
  const { data: users } = useUsers();
  const startEval = useStartEvaluation();
  const [selectedTeacher, setSelectedTeacher] = useState("");

  const teachers = users?.filter(u => u.role === 'teacher') || [];

  const handleStart = () => {
    if (!selectedTeacher) return;
    startEval.mutate(parseInt(selectedTeacher));
    setSelectedTeacher("");
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">التقييمات</h2>
          <p className="text-muted-foreground mt-1">نتائج التقييمات الموضوعية المنجزة بواسطة الذكاء الاصطناعي.</p>
        </div>

        {user?.role !== 'teacher' && (
          <div className="flex items-center gap-2 bg-card p-2 rounded-xl border shadow-sm w-full md:w-auto">
            <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
              <SelectTrigger className="w-[200px] border-none shadow-none focus:ring-0">
                <SelectValue placeholder="اختر معلم للتقييم..." />
              </SelectTrigger>
              <SelectContent>
                {teachers.map(t => (
                  <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleStart}
              disabled={!selectedTeacher || startEval.isPending}
              className="bg-gradient-to-r from-primary to-accent hover-elevate"
            >
              {startEval.isPending ? <Loader2 className="w-4 h-4 animate-spin me-2" /> : <Bot className="w-4 h-4 me-2" />}
              بدء التقييم
            </Button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {evals?.filter(e => user?.role === 'teacher' ? e.teacherId === user.id : true).map(evaluation => {
            const tUser = users?.find(u => u.id === evaluation.teacherId);
            return (
              <Card key={evaluation.id} className="p-0 border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-gradient-to-br from-primary/10 to-transparent p-6 border-b flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center">
                      <Award className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">{tUser?.name}</h3>
                      <p className="text-sm text-muted-foreground">تقييم الذكاء الاصطناعي الشامل</p>
                    </div>
                  </div>
                  <div className="text-center bg-white p-3 rounded-xl shadow-sm border">
                    <p className="text-xs text-muted-foreground font-bold mb-1">الدرجة النهائية</p>
                    <div className="text-2xl font-bold text-primary flex items-center gap-1">
                      {evaluation.totalScore}<span className="text-sm">/100</span>
                    </div>
                  </div>
                </div>
                {/* Render tie-breaker and detailed info */}
                <div className="p-4 bg-muted/30 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="w-4 h-4 text-primary" />
                    <span className="font-bold text-sm text-foreground">الرؤية التحليلية للمفاضلة</span>
                  </div>
                  <div className="text-sm text-muted-foreground leading-relaxed prose prose-sm max-w-none prose-p:mb-2 prose-ul:list-disc prose-ul:ms-4">
                    <ReactMarkdown>
                      {(evaluation.details as any).tieBreakerSummary}
                    </ReactMarkdown>
                  </div>
                </div>
              </Card>
            )
          })}
          {evals?.filter(e => user?.role === 'teacher' ? e.teacherId === user.id : true).length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground flex flex-col items-center">
              <Bot className="w-16 h-16 text-muted-foreground/30 mb-4" />
              لا توجد تقييمات منجزة حتى الآن.
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
