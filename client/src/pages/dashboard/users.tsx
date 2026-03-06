import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useUsers, useCreateUser, useDeleteUser } from "@/hooks/use-users";
import { useSchools } from "@/hooks/use-schools";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Plus, Loader2, Trash2, Eye, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";

export function UsersManager() {
  const { data: currentUser } = useAuth();
  const { data: users, isLoading } = useUsers();
  const { data: schools } = useSchools();
  const createUser = useCreateUser();
  const deleteUser = useDeleteUser();
  const [open, setOpen] = useState(false);
  const [showPasswords, setShowPasswords] = useState<Record<number, boolean>>({});

  const togglePassword = (id: number) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Form state
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("teacher");
  const [schoolId, setSchoolId] = useState<string>("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createUser.mutateAsync({
      name, username, password, role,
      schoolId: schoolId ? parseInt(schoolId) : (currentUser?.role === 'principal' ? currentUser.schoolId : null)
    });
    setOpen(false);
    // Reset
    setName(""); setUsername(""); setPassword(""); setRole("teacher"); setSchoolId("");
  };

  const filteredUsers = users?.filter(u => {
    if (currentUser?.role === 'admin') return true;
    return u.schoolId === currentUser?.schoolId;
  });

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">إدارة المستخدمين</h2>
          <p className="text-muted-foreground mt-1">إضافة وإدارة المعلمين وقادة المدارس</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="hover-elevate shadow-md shadow-primary/20">
              <Plus className="w-4 h-4 me-2" />
              إضافة مستخدم
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة مستخدم جديد</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">الاسم الكامل</label>
                <Input required value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">اسم المستخدم (للدخول)</label>
                <Input required value={username} onChange={(e) => setUsername(e.target.value)} dir="ltr" className="text-right" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">كلمة المرور</label>
                <Input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} dir="ltr" className="text-right" />
              </div>
              
              {currentUser?.role === 'admin' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">الرتبة</label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="teacher">معلم</SelectItem>
                      <SelectItem value="principal">قائد مدرسة</SelectItem>
                      <SelectItem value="admin">مدير نظام</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {(role !== 'admin' && currentUser?.role === 'admin') && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">المدرسة</label>
                  <Select value={schoolId} onValueChange={setSchoolId} required>
                    <SelectTrigger><SelectValue placeholder="اختر المدرسة" /></SelectTrigger>
                    <SelectContent>
                      {schools?.map(s => (
                        <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={createUser.isPending}>
                {createUser.isPending ? <Loader2 className="w-4 h-4 animate-spin me-2" /> : null}
                إنشاء حساب
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-start">
              <thead className="bg-muted/50 text-muted-foreground border-b">
                <tr>
                  <th className="py-4 px-6 font-medium text-start">الاسم</th>
                  <th className="py-4 px-6 font-medium text-start">المدرسة</th>
                  <th className="py-4 px-6 font-medium text-start">اسم المستخدم</th>
                  <th className="py-4 px-6 font-medium text-start">كلمة المرور</th>
                  <th className="py-4 px-6 font-medium text-start">الرتبة</th>
                  <th className="py-4 px-6 font-medium text-start">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers?.map(u => {
                  const school = schools?.find(s => s.id === u.schoolId);
                  return (
                    <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-6 font-medium flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                          {u.name.charAt(0)}
                        </div>
                        {u.name}
                      </td>
                      <td className="py-4 px-6 text-muted-foreground">{school?.name || 'مدير نظام'}</td>
                      <td className="py-4 px-6 text-muted-foreground" dir="ltr">{u.username}</td>
                      <td className="py-4 px-6 text-muted-foreground">
                        <div className="flex items-center gap-2" dir="ltr">
                          <span>{showPasswords[u.id] ? u.password : '••••••••'}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => togglePassword(u.id)}
                          >
                            {showPasswords[u.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </Button>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                          {u.role === 'admin' ? 'مدير' : u.role === 'principal' ? 'قائد مدرسة' : 'معلم'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            if(confirm("هل أنت متأكد من حذف هذا المستخدم؟")) {
                              deleteUser.mutate(u.id);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
