import { useLogin } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Loader2, UserRound, Lock } from "lucide-react";

export function Login() {
  const loginMutation = useLogin();

  const handleRoleLogin = (role: 'teacher' | 'principal' | 'admin') => {
    const credentials = {
      teacher: { username: "a123", password: "123" },
      principal: { username: "principal", password: "123" },
      admin: { username: "admin", password: "admin123" }
    };
    loginMutation.mutate(credentials[role]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] start-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] end-[-10%] w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>

      <Card className="w-full max-w-md p-8 shadow-2xl border-white/40 glass-panel relative z-10">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-tr from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30 rotate-3 hover:rotate-0 transition-transform duration-300">
            <span className="text-4xl font-display font-bold text-white">VE</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">تسجيل الدخول</h1>
          <p className="text-muted-foreground mt-2 font-medium">مرحباً بك في منصة بصير التعليمية</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleRoleLogin('principal')}
            disabled={loginMutation.isPending}
            className="w-full text-start p-4 rounded-xl border border-primary/20 bg-white/50 hover:bg-white hover:border-primary hover:shadow-lg transition-all group relative overflow-hidden flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">دخول كمدير مدرسة</h3>
              <p className="text-sm text-muted-foreground">صلاحيات إدارة المعلمين والتقييمات</p>
            </div>
          </button>

          <button
            onClick={() => handleRoleLogin('teacher')}
            disabled={loginMutation.isPending}
            className="w-full text-start p-4 rounded-xl border border-primary/20 bg-white/50 hover:bg-white hover:border-primary hover:shadow-lg transition-all group relative overflow-hidden flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-colors">
              <UserRound className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">دخول كمعلم</h3>
              <p className="text-sm text-muted-foreground">صلاحيات رفع الشواهد والمؤشرات</p>
            </div>
          </button>

          <div className="pt-4 border-t border-border/50">
            <button
              onClick={() => handleRoleLogin('admin')}
              disabled={loginMutation.isPending}
              className="w-full text-start p-3 rounded-lg border border-transparent hover:bg-muted/50 transition-colors flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">دخول كمدير نظام</h3>
                <p className="text-xs text-muted-foreground">للتحكم الشامل للمنصة</p>
              </div>
            </button>
          </div>

          {loginMutation.isPending && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-xl z-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
