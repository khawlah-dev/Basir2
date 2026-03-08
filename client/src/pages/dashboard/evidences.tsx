import { useState, useRef } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useEvidences, useCreateEvidence, useApproveEvidence, useUpdateEvidence, useDeleteEvidence } from "@/hooks/use-evidences";
import { useUsers } from "@/hooks/use-users";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, Clock, Pencil, Trash2, X, FileImage, FileVideo, FileText, Download, PlayCircle, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { type Evidence } from "@shared/schema";

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
  const updateEvidence = useUpdateEvidence();
  const deleteEvidence = useDeleteEvidence();

  const formRef = useRef<HTMLDivElement>(null);

  // Upload Form State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [criteria, setCriteria] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!criteria || !description) return;
    if (!editingId && !file) return;
    if (!user) return;

    if (editingId !== null) {
      // Update is still JSON for now since we're not replacing the file in update yet
      await updateEvidence.mutateAsync({
        id: editingId,
        data: {
          teacherId: user.id,
          criteria,
          description,
        } as any
      });
      setEditingId(null);
    } else {
      const formData = new FormData();
      formData.append("teacherId", user.id.toString());
      formData.append("criteria", criteria);
      formData.append("description", description);
      if (file) formData.append("file", file);

      await createEvidence.mutateAsync(formData);
    }

    setCriteria(""); setDescription(""); setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = (ev: Evidence) => {
    setEditingId(ev.id);
    setCriteria(ev.criteria);
    setDescription(ev.description);
    setFile(null);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا الشاهد نهائياً؟")) {
      try {
        await deleteEvidence.mutateAsync(id);

        if (editingId === id) {
          setEditingId(null);
          setCriteria(""); setDescription(""); setFile(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      } catch (error) {
        console.error("Delete mutation failed:", error);
      }
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setCriteria(""); setDescription(""); setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (user?.role === 'teacher') {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <div className="mb-8" ref={formRef}>
            <h2 className="text-2xl font-display font-bold">{editingId ? 'تعديل الشاهد' : 'رفع الشواهد'}</h2>
            <p className="text-muted-foreground mt-1">
              {editingId ? 'قم بتحديث المعلومات المرتبطة بالشاهد المحدد.' : 'قم برفع الصور التي تثبت كفاءتك في عناصر التقييم المختلفة.'}
            </p>
          </div>

          <Card className="p-6 border-border shadow-md">
            <form onSubmit={handleUpload} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="criteria-select">عنصر التقييم</Label>
                <Select value={criteria} onValueChange={setCriteria} required>
                  <SelectTrigger id="criteria-select"><SelectValue placeholder="اختر المعيار" /></SelectTrigger>
                  <SelectContent>
                    {CRITERIA.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file-upload">الملف (صورة، فيديو، أو مستند)</Label>
                <input
                  id="file-upload"
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  accept="image/*,video/*,application/pdf,.doc,.docx"
                  required={!editingId}
                />
                <p className="text-[10px] text-muted-foreground mt-1">المجلد يدعم الصور، الفيديوهات، وملفات PDF/Word</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="evidence-description">وصف الشاهد</Label>
                <Textarea
                  id="evidence-description"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="اكتب وصفاً مختصراً يوضح كيف يغطي هذا الشاهد المعيار المطلوب..."
                  className="min-h-[100px] resize-none"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1 text-lg h-12 shadow-md" disabled={createEvidence.isPending || updateEvidence.isPending}>
                  {(createEvidence.isPending || updateEvidence.isPending) ? (
                    <Loader2 className="w-5 h-5 animate-spin me-2" />
                  ) : editingId ? (
                    <Pencil className="w-5 h-5 me-2" />
                  ) : (
                    <FileImage className="w-5 h-5 me-2" />
                  )}
                  {editingId ? 'حفظ التعديلات' : 'رفع واعتماد'}
                </Button>

                {editingId && (
                  <Button type="button" variant="outline" className="h-12 w-12 shrink-0 md:w-auto md:px-6" onClick={cancelEdit}>
                    <X className="w-5 h-5 md:me-2" />
                    <span className="hidden md:inline">إلغاء</span>
                  </Button>
                )}
              </div>
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
                  <div className="h-40 w-full bg-muted relative flex items-center justify-center overflow-hidden group">
                    {ev.fileType === 'image' && <img src={ev.fileUrl} alt="شاهد" className="w-full h-full object-cover transition-transform group-hover:scale-105" />}
                    {ev.fileType === 'video' && (
                      <div className="relative w-full h-full flex items-center justify-center bg-black">
                        <video
                          src={`${ev.fileUrl}#t=0.1`}
                          className="w-full h-full object-cover opacity-60"
                          muted
                          playsInline
                          preload="metadata"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <PlayCircle className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all cursor-pointer" />
                        </div>
                      </div>
                    )}
                    {ev.fileType === 'document' && (
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="w-12 h-12 text-muted-foreground" />
                        <span className="text-xs font-medium">مستند</span>
                      </div>
                    )}

                    {/* Overlay for quick view */}
                    {(ev.fileType === 'image' || ev.fileType === 'video') && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                            <Eye className="w-6 h-6 text-white" />
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-none">
                          <DialogHeader className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-10">
                            <DialogTitle className="text-white">{ev.criteria}</DialogTitle>
                          </DialogHeader>
                          <div className="flex items-center justify-center min-h-[50vh]">
                            {ev.fileType === 'image' ? (
                              <img src={ev.fileUrl} alt="شاهد" className="max-w-full max-h-[85vh] object-contain" />
                            ) : (
                              <video src={ev.fileUrl} controls autoPlay playsInline className="max-w-full max-h-[85vh]" />
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}

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
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed flex-1">{ev.description}</p>

                    {ev.fileType === 'document' && (
                      <Button variant="outline" size="sm" asChild className="mb-2">
                        <a href={ev.fileUrl} target="_blank" rel="noreferrer">
                          <Download className="w-3 h-3 me-2" /> عرض المستند
                        </a>
                      </Button>
                    )}

                    <div className="mt-4 flex gap-2 pt-4 border-t">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(ev)}>
                        <Pencil className="w-4 h-4 me-2" /> تعديل
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(ev.id)} disabled={deleteEvidence.isPending}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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
            <Card key={ev.id} className="overflow-hidden flex flex-col border shadow-sm group">
              <div className="h-48 w-full bg-muted relative flex items-center justify-center overflow-hidden">
                {ev.fileType === 'image' && <img src={ev.fileUrl} alt="شاهد" className="w-full h-full object-cover transition-transform group-hover:scale-105" />}
                {ev.fileType === 'video' && (
                  <div className="relative w-full h-full flex items-center justify-center bg-black">
                    <video
                      src={`${ev.fileUrl}#t=0.1`}
                      className="w-full h-full object-cover opacity-60"
                      muted
                      playsInline
                      preload="metadata"
                    />
                    <div className="absolute inset-0 flex items-center justify-center cursor-pointer">
                      <PlayCircle className="w-14 h-14 text-white opacity-90 group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                )}
                {ev.fileType === 'document' && (
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="w-12 h-12 text-muted-foreground" />
                    <span className="text-sm font-medium">مستند (PDF/Word)</span>
                    <Button variant="ghost" asChild className="text-primary hover:text-primary/80">
                      <a href={ev.fileUrl} target="_blank" rel="noreferrer">فتح الملف</a>
                    </Button>
                  </div>
                )}

                {/* Lightbox for large view */}
                {(ev.fileType === 'image' || ev.fileType === 'video') && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer z-20">
                        <Eye className="w-8 h-8 text-white" />
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-5xl p-0 overflow-hidden bg-black border-none">
                      <DialogHeader className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-10">
                        <DialogTitle className="text-white flex items-center gap-2">
                          {ev.criteria}
                          <span className="text-xs font-normal opacity-70">
                            (بواسطة: {users?.find(u => u.id === ev.teacherId)?.name})
                          </span>
                        </DialogTitle>
                      </DialogHeader>
                      <div className="flex items-center justify-center min-h-[60vh]">
                        {ev.fileType === 'image' ? (
                          <img src={ev.fileUrl} alt="شاهد" className="max-w-full max-h-[90vh] object-contain" />
                        ) : (
                          <video src={ev.fileUrl} controls autoPlay playsInline className="max-w-full max-h-[90vh]" />
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
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
