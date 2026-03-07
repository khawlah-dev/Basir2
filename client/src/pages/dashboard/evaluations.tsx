import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useEvaluations, useStartEvaluation, useUpdateEvaluationScore, useCreateManualEvaluation } from "@/hooks/use-evaluations";
import { useUsers } from "@/hooks/use-users";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Bot, Star, Award, Edit2, Check, X } from "lucide-react";
import ReactMarkdown from "react-markdown";

export function EvaluationsManager() {
  const { data: user } = useAuth();
  const { data: evals, isLoading } = useEvaluations();
  const { data: users } = useUsers();
  const startEval = useStartEvaluation();
  const updateScore = useUpdateEvaluationScore();
  const createManual = useCreateManualEvaluation();
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [manualInputScore, setManualInputScore] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editScore, setEditScore] = useState("");

  const teachers = users?.filter(u => u.role === 'teacher') || [];

  const handleStart = () => {
    if (!selectedTeacher) return;
    startEval.mutate(parseInt(selectedTeacher));
    setSelectedTeacher("");
    setManualInputScore("");
  };

  const handleManualSave = () => {
    if (!selectedTeacher || !manualInputScore) return;
    const score = parseFloat(manualInputScore);
    if (isNaN(score) || score < 0 || score > 100) return;
    createManual.mutate({ teacherId: parseInt(selectedTeacher), manualScore: score }, {
      onSuccess: () => {
        setSelectedTeacher("");
        setManualInputScore("");
      }
    });
  };

  const handleEditClick = (id: number, currentScore: number) => {
    setEditingId(id);
    setEditScore(currentScore.toString());
  };

  const handleSaveScore = (id: number) => {
    const score = parseFloat(editScore);
    if (isNaN(score) || score < 0 || score > 100) return;
    updateScore.mutate({ id, manualScore: score }, {
      onSuccess: () => setEditingId(null)
    });
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">التقييمات</h2>
          <p className="text-muted-foreground mt-1">نتائج التقييمات الموضوعية المنجزة بواسطة الذكاء الاصطناعي مع إمكانية التقييم اليدوي.</p>
        </div>

        {user?.role !== 'teacher' && (
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 bg-card p-3 rounded-xl border shadow-sm w-full md:w-auto">
            <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
              <SelectTrigger className="w-full md:w-[200px] border-none shadow-none focus:ring-0">
                <SelectValue placeholder="اختر معلم..." />
              </SelectTrigger>
              <SelectContent>
                {teachers.map(t => (
                  <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 border-t md:border-t-0 md:border-s pt-2 md:pt-0 md:ps-2">
              <Input
                type="number"
                placeholder="الدرجة..."
                value={manualInputScore}
                onChange={(e) => setManualInputScore(e.target.value)}
                className="w-20 h-9"
              />
              <Button
                onClick={handleManualSave}
                disabled={!selectedTeacher || !manualInputScore || createManual.isPending}
                size="sm"
                className="bg-accent hover:bg-accent/90 whitespace-nowrap"
              >
                {createManual.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 me-1" />}
                حفظ يدوي
              </Button>
              <div className="h-6 w-px bg-border mx-1" />
              <Button
                onClick={handleStart}
                disabled={!selectedTeacher || startEval.isPending}
                size="sm"
                className="bg-gradient-to-r from-primary to-accent hover-elevate whitespace-nowrap"
              >
                {startEval.isPending ? <Loader2 className="w-4 h-4 animate-spin me-2" /> : <Bot className="w-4 h-4 me-2" />}
                تقييم AI
              </Button>
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {evals?.filter(e => user?.role === 'teacher' ? e.teacherId === user.id : true).map(evaluation => {
            const tUser = users?.find(u => u.id === evaluation.teacherId);
            const isEditing = editingId === evaluation.id;
            const isOverridden = (evaluation as any).manualScore !== null;

            return (
              <Card key={evaluation.id} className="p-0 border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-gradient-to-br from-primary/10 to-transparent p-6 border-b flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center relative">
                      <Award className="w-8 h-8 text-primary" />
                      {isOverridden && (
                        <div className="absolute -top-1 -right-1 bg-accent text-white rounded-full p-1 border-2 border-white">
                          <Edit2 className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">{tUser?.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {isOverridden ? "تم التعديل بواسطة المدير" : "تقييم الذكاء الاصطناعي الشامل"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="text-center bg-white p-3 rounded-xl shadow-sm border min-w-[120px]">
                      <p className="text-xs text-muted-foreground font-bold mb-1">الدرجة النهائية</p>
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            value={editScore}
                            onChange={(e) => setEditScore(e.target.value)}
                            className="h-8 w-16 text-center text-lg font-bold p-1"
                            autoFocus
                          />
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleSaveScore(evaluation.id)}>
                            <Check className="w-4 h-4 text-green-600" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setEditingId(null)}>
                            <X className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      ) : (
                        <div className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
                          {evaluation.totalScore}<span className="text-sm">/100</span>
                          {user?.role !== 'teacher' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 ms-1 opacity-50 hover:opacity-100"
                              onClick={() => handleEditClick(evaluation.id, evaluation.totalScore)}
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                    {isOverridden && (
                      <p className="text-[10px] text-muted-foreground">
                        درجة الـ AI الأصلية: {(evaluation as any).aiScore}
                      </p>
                    )}
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
