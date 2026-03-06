import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useSchools, useCreateSchool, useDeleteSchool } from "@/hooks/use-schools";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Plus, Loader2, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function SchoolsManager() {
  const { data: schools, isLoading } = useSchools();
  const createSchool = useCreateSchool();
  const deleteSchool = useDeleteSchool();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await createSchool.mutateAsync({ name });
    setOpen(false);
    setName("");
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">إدارة المدارس</h2>
          <p className="text-muted-foreground mt-1">عرض وإضافة المدارس المسجلة في النظام</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="hover-elevate shadow-md shadow-primary/20">
              <Plus className="w-4 h-4 me-2" />
              إضافة مدرسة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة مدرسة جديدة</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">اسم المدرسة</label>
                <Input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="مدرسة مكة المكرمة الثانوية..."
                />
              </div>
              <Button type="submit" className="w-full" disabled={createSchool.isPending}>
                {createSchool.isPending ? <Loader2 className="w-4 h-4 animate-spin me-2" /> : null}
                حفظ
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schools?.map(school => (
            <Card key={school.id} className="p-6 border border-border/50 hover:border-primary/30 transition-colors shadow-sm relative group">
              <div className="absolute top-4 end-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    if(confirm("تحذير: حذف المدرسة سيؤدي لحذف جميع الأعضاء والتقييمات التابعة لها. هل أنت متأكد؟")) {
                      deleteSchool.mutate(school.id);
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{school.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">الرقم التعريفي: {school.id}</p>
                </div>
              </div>
            </Card>
          ))}
          {schools?.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              لا توجد مدارس مسجلة بعد.
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
