import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useFlags, useCreateFlag, useDeleteFlag } from "@/hooks/use-flags";
import { useUsers } from "@/hooks/use-users";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Flag as FlagIcon, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function FlagsManager() {
  const { data: user } = useAuth();
  const { data: flags, isLoading } = useFlags();
  const { data: users } = useUsers();
  const createFlag = useCreateFlag();
  const deleteFlag = useDeleteFlag();
  const [open, setOpen] = useState(false);
  
  const [teacherId, setTeacherId] = useState("");
  const [note, setNote] = useState("");

  const teachers = users?.filter(u => {
    if (user?.role === 'admin') return u.role === 'teacher';
    return u.role === 'teacher' && u.schoolId === user?.schoolId;
  }) || [];

  const filteredFlags = flags?.filter(f => {
    if (user?.role === 'admin') return true;
    const teacher = users?.find(u => u.id === f.teacherId);
    return teacher?.schoolId === user?.schoolId;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherId || !note || !user) return;
    
    await createFlag.mutateAsync({
      teacherId: parseInt(teacherId),
      authorId: user.id,
      note
    });
    
    setOpen(false);
    setTeacherId(""); setNote("");
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">الملاحظات (Flags)</h2>
          <p className="text-muted-foreground mt-1">تدوين ملاحظات هامة على أداء المعلمين.</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="hover-elevate shadow-md shadow-amber-500/20 bg-amber-500 hover:bg-amber-600 text-white">
              <Plus className="w-4 h-4 me-2" />
              إضافة ملاحظة
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة ملاحظة جديدة</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">المعلم</label>
                <Select value={teacherId} onValueChange={setTeacherId} required>
                  <SelectTrigger><SelectValue placeholder="اختر المعلم..." /></SelectTrigger>
                  <SelectContent>
                    {teachers.map(t => (
                      <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">الملاحظة</label>
                <Textarea 
                  required 
                  value={note} 
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="اكتب ملاحظاتك بوضوح..."
                  className="min-h-[120px] resize-none"
                />
              </div>

              <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white" disabled={createFlag.isPending}>
                {createFlag.isPending ? <Loader2 className="w-4 h-4 animate-spin me-2" /> : <FlagIcon className="w-4 h-4 me-2" />}
                حفظ الملاحظة
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFlags?.map(flag => {
            const tUser = users?.find(u => u.id === flag.teacherId);
            const aUser = users?.find(u => u.id === flag.authorId);
            return (
              <Card key={flag.id} className="p-6 border-s-4 border-s-amber-500 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 end-0 p-4 opacity-5 pointer-events-none">
                  <FlagIcon className="w-24 h-24" />
                </div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-foreground">{tUser?.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">كُتبت بواسطة: {aUser?.name || 'مدير'}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          if(confirm("هل أنت متأكد من حذف هذه الملاحظة؟")) {
                            deleteFlag.mutate(flag.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <div className="bg-amber-100 text-amber-700 p-2 rounded-full h-8 w-8 flex items-center justify-center">
                        <FlagIcon className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed bg-muted/50 p-3 rounded-lg border">
                    {flag.note}
                  </p>
                </div>
              </Card>
            )
          })}
          {filteredFlags?.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              لا توجد ملاحظات مسجلة.
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
