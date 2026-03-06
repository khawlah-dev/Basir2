import { useState } from "react";
import { useLogin } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, UserRound, Lock } from "lucide-react";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ username, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] start-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] end-[-10%] w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>

      <Card className="w-full max-w-md p-8 shadow-2xl border-white/40 glass-panel relative z-10">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-tr from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30 rotate-3 hover:rotate-0 transition-transform duration-300">
            <span className="text-4xl font-display font-bold text-white">ب</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">تسجيل الدخول</h1>
          <p className="text-muted-foreground mt-2 font-medium">مرحباً بك في منصة بصير التعليمية</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2 relative">
            <label className="text-sm font-bold text-foreground/80">اسم المستخدم</label>
            <div className="relative">
              <UserRound className="w-5 h-5 absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="أدخل اسم المستخدم"
                className="ps-10 h-12 bg-white/50 border-primary/20 focus-visible:ring-primary/30"
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-2 relative">
            <label className="text-sm font-bold text-foreground/80">كلمة المرور</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="ps-10 h-12 bg-white/50 border-primary/20 focus-visible:ring-primary/30 text-start"
                dir="ltr"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-bold mt-4 bg-gradient-to-l from-primary to-accent hover:opacity-90 transition-all shadow-lg shadow-primary/25 hover-elevate"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : "دخول"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
