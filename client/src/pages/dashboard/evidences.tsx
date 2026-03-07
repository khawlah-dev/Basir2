import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useEvidences, useCreateEvidence, useApproveEvidence } from "@/hooks/use-evidences";
import { useUsers } from "@/hooks/use-users";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CheckCircle, FileImage, Clock } from "lucide-react";
import { ImageUpload } from "@/components/upload/image-upload";

const CRITERIA = [
  "أداء الواجبات الوظيفية 10%",
  "التفاعل مع المجتمع المهني 10%",
  "التفاعل مع أولياء الأمور 10%",
  "التنويع في استراتيجيات التدريس 10%",
  "تحسين نتائج المتعلمين 10%",
  "إعداد وتنفيذ خطة التعلم 10%",
  "توظيف تقنيات ووسائل التعلم المناسبة 10%",
  "تهيئة بيئة تعليمية 5%",
  "الادارة الصفية 5%",
  "تحليل نتائج المتعلمين وتشخيص مستواهم 10%",
  "تنوع اساليب التقييم 10%",
];

export function EvidencesManager() {
  const { data: user } = useAuth();
  const { data: evidences, isLoading } = useEvidences();
  const { data: users } = useUsers();
  const createEvidence = useCreateEvidence();
  const approveEvidence = useApproveEvidence();

  // Upload Form State
  const [criteria, setCriteria] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!criteria || !description || !imageUrl) return;
    if (!user) return;

    await createEvidence.mutateAsync({
      teacherId: user.id,
      criteria,
      description,
      imageUrl
    });

    setCriteria(""); setDescription(""); setImageUrl("");
  };

  if (user?.role === 'teacher') {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-display font-bold">رفع الشواهد</h2>
            <p className="text-muted-foreground mt-1">قم برفع الصور التي تثبت كفاءتك في عناصر التقييم المختلفة.</p>
          </div>

          <Card className="p-6 border-border shadow-md">
            <form onSubmit={handleUpload} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">عنصر التقييم</label>
                <Select value={criteria} onValueChange={setCriteria} required>
                  <SelectTrigger><SelectValue placeholder="اختر المعيار" /></SelectTrigger>
                  <SelectContent>
                    {CRITERIA.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">صورة الشاهد</label>
                <ImageUpload value={imageUrl} onChange={setImageUrl} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">وصف الشاهد</label>
                <Textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="اكتب وصفاً مختصراً يوضح كيف يغطي هذا الشاهد المعيار المطلوب..."
                  className="min-h-[100px] resize-none"
                />
              </div>

              <Button type="submit" className="w-full text-lg h-12 shadow-lg" disabled={createEvidence.isPending}>
                {createEvidence.isPending ? <Loader2 className="w-5 h-5 animate-spin me-2" /> : <FileImage className="w-5 h-5 me-2" />}
                رفع واعتماد
              </Button>
            </form>
          </Card>

          <div className="mt-12 mb-6">
            <h3 className="text-xl font-display font-bold">شواهدي السابقة</h3>
            <p className="text-muted-foreground mt-1">قائمة بالشواهد التي قمت برفعها مسبقاً لمراجعة حالتها.</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
              {evidences?.filter(ev => ev.teacherId === user.id).map(ev => (
                <Card key={ev.id} className="overflow-hidden flex flex-col border shadow-sm">
                  <div className="h-40 w-full bg-muted relative">
                    <img src={ev.imageUrl} alt="شاهد" className="w-full h-full object-cover" />
                    {ev.status === 'approved' ? (
                      <div className="absolute top-2 end-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-md font-bold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> معتمد
                      </div>
                    ) : (
                      <div className="absolute top-2 end-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-md font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> بانتظار الاعتماد
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h4 className="font-bold text-md text-primary">{ev.criteria}</h4>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-3 leading-relaxed flex-1">{ev.description}</p>
                  </div>
                </Card>
              ))}
              {evidences?.filter(ev => ev.teacherId === user.id).length === 0 && (
                <div className="col-span-full py-8 text-center text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
                  لم تقم برفع أي شواهد حتى الآن.
                </div>
              )}
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  // Admin / Principal View
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-display font-bold">اعتماد الشواهد</h2>
        <p className="text-muted-foreground mt-1">مراجعة الشواهد المرفوعة من قبل المعلمين.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {evidences?.map(ev => (
            <Card key={ev.id} className="overflow-hidden flex flex-col border shadow-sm">
              <div className="h-48 w-full bg-muted relative">
                {/* Normally we'd use a real src, base64 works here */}
                <img src={ev.imageUrl} alt="شاهد" className="w-full h-full object-cover" />
                <div className="absolute top-2 start-2 bg-background/90 backdrop-blur text-xs px-2 py-1 rounded-md font-bold">
                  {users?.find(u => u.id === ev.teacherId)?.name}
                </div>
                {ev.status === 'approved' ? (
                  <div className="absolute top-2 end-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-md font-bold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> معتمد
                  </div>
                ) : (
                  <div className="absolute top-2 end-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-md font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> بانتظار الاعتماد
                  </div>
                )}
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h4 className="font-bold text-lg text-primary">{ev.criteria}</h4>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed flex-1">{ev.description}</p>

                {ev.status === 'pending' && (
                  <Button
                    className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => approveEvidence.mutate(ev.id)}
                    disabled={approveEvidence.isPending}
                  >
                    اعتماد الشاهد
                  </Button>
                )}
              </div>
            </Card>
          ))}
          {evidences?.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              لا توجد شواهد مرفوعة حالياً.
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
