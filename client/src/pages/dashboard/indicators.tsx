import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useIndicators, useCreateIndicator, useApproveIndicator } from "@/hooks/use-indicators";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CheckCircle, Clock, Activity } from "lucide-react";

export function IndicatorsManager() {
  const { data: user } = useAuth();
  const { data: indicators, isLoading } = useIndicators();
  const createIndicator = useCreateIndicator();
  const approveIndicator = useApproveIndicator();

  const [type, setType] = useState("training");
  const [title, setTitle] = useState("");
  const [hours, setHours] = useState("");

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !hours || !user) return;
    
    await createIndicator.mutateAsync({
      teacherId: user.id,
      type,
      title,
      hours: parseInt(hours)
    });
    
    setTitle(""); setHours("");
  };

  if (user?.role === 'teacher') {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-display font-bold">رفع المؤشرات</h2>
            <p className="text-muted-foreground mt-1">سجل ساعات التطوع والدورات التدريبية (التطوير المهني).</p>
          </div>

          <Card className="p-6 border-border shadow-md">
            <form onSubmit={handleUpload} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">نوع المؤشر</label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="training">دورة تدريبية (تطوير مهني)</SelectItem>
                    <SelectItem value="volunteering">ساعات تطوع</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">عنوان الدورة / العمل التطوعي</label>
                <Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثال: دورة في استراتيجيات التعلم النشط..." />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">عدد الساعات</label>
                <Input required type="number" min="1" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="مثال: 10" dir="ltr" className="text-right" />
              </div>

              <Button type="submit" className="w-full text-lg h-12 shadow-lg" disabled={createIndicator.isPending}>
                {createIndicator.isPending ? <Loader2 className="w-5 h-5 animate-spin me-2" /> : <Activity className="w-5 h-5 me-2" />}
                حفظ وإرسال
              </Button>
            </form>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-display font-bold">اعتماد المؤشرات</h2>
        <p className="text-muted-foreground mt-1">مراجعة الدورات التدريبية وساعات التطوع للمعلمين.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
          <table className="w-full text-sm text-start">
            <thead className="bg-muted/50 text-muted-foreground border-b">
              <tr>
                <th className="py-4 px-6 font-medium text-start">المعلم</th>
                <th className="py-4 px-6 font-medium text-start">النوع</th>
                <th className="py-4 px-6 font-medium text-start">العنوان</th>
                <th className="py-4 px-6 font-medium text-start">الساعات</th>
                <th className="py-4 px-6 font-medium text-start">الحالة</th>
                <th className="py-4 px-6 font-medium text-start">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {indicators?.map(ind => (
                <tr key={ind.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-4 px-6 font-bold">#{ind.teacherId}</td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-bold">
                      {ind.type === 'training' ? 'دورة تدريبية' : 'تطوع'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-foreground font-medium">{ind.title}</td>
                  <td className="py-4 px-6">{ind.hours} ساعة</td>
                  <td className="py-4 px-6">
                    {ind.status === 'approved' ? (
                      <span className="flex items-center gap-1 text-emerald-600 font-bold text-xs"><CheckCircle className="w-4 h-4"/> معتمد</span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-500 font-bold text-xs"><Clock className="w-4 h-4"/> معلق</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {ind.status === 'pending' && (
                      <Button size="sm" variant="outline" className="border-emerald-500 text-emerald-600 hover:bg-emerald-50" onClick={() => approveIndicator.mutate(ind.id)}>
                        اعتماد
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {indicators?.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">لا توجد مؤشرات مرفوعة حالياً.</div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
