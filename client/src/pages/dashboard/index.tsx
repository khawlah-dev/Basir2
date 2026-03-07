import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useEvaluations } from "@/hooks/use-evaluations";
import { useUsers } from "@/hooks/use-users";
import { useEvidences } from "@/hooks/use-evidences";
import { useIndicators } from "@/hooks/use-indicators";
import { Activity, BarChart4, FileText, Users, Award, Trophy } from "lucide-react";

export function DashboardHome() {
  const { data: user } = useAuth();
  const { data: evals } = useEvaluations();
  const { data: users } = useUsers();
  const { data: evidences } = useEvidences();
  const { data: indicators } = useIndicators();

  if (user?.role === 'teacher') {
    return (
      <DashboardLayout>
        <div className="mb-8">
          <h2 className="text-3xl font-display font-bold text-foreground">مرحباً بك، {user.name}</h2>
          <p className="text-muted-foreground mt-2">نقرأ الأداء لنقود التحسين.</p>
        </div>
        <Card className="p-8 border-none shadow-md bg-gradient-to-br from-primary to-accent text-white">
          <h3 className="text-2xl font-display font-bold mb-4">بصير: شريكك في التميز التعليمي</h3>
          <p className="text-primary-foreground/80 leading-relaxed text-lg">
            يمكنك البدء برفع الشواهد والمؤشرات الخاصة بك من خلال القائمة الجانبية. سيقوم النظام بتحليل أدائك بدقة وموضوعية.
          </p>
        </Card>
      </DashboardLayout>
    );
  }

  // Calculate top 7 evaluated teachers
  const teachers = users?.filter(u => u.role === 'teacher') || [];

  // Create a sorted list of unique teachers by highest evaluation
  const topEvaluations = [...(evals || [])]
    .sort((a, b) => b.totalScore - a.totalScore)
    // Optional: filter to make sure we only grab latest evaluation per teacher if there are duplicates
    .reduce((acc: typeof evals, current) => {
      const x = acc?.find(item => item.teacherId === current.teacherId);
      if (!x) {
        return (acc || []).concat([current]);
      } else {
        return acc || [];
      }
    }, [])
    ?.slice(0, 7) || [];

  const stats = [
    { title: "الشواهد المرفوعة", value: evidences?.length ?? "0", icon: FileText, color: "text-blue-500", bg: "bg-blue-50" },
    { title: "المؤشرات المعتمدة", value: indicators?.length ?? "0", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-50" },
    { title: "التقييمات المنجزة", value: evals?.length || "0", icon: BarChart4, color: "text-purple-500", bg: "bg-purple-50" },
    { title: "المعلمين", value: teachers.length || "0", icon: Users, color: "text-amber-500", bg: "bg-amber-50" },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-foreground">
          {user?.role === 'admin' ? 'إحصائيات النظام' : 'إحصائيات المدرسة'}
        </h2>
        <p className="text-muted-foreground mt-2">
          {user?.role === 'admin' ? 'نظرة عامة على أداء النظام بالكامل.' : 'نظرة عامة على أداء مدرستك.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="p-6 border-none shadow-md shadow-black/5 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <h3 className="text-3xl font-bold mt-2 text-foreground">{stat.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Banner / Status Box */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="p-8 border-none shadow-md bg-gradient-to-br from-primary to-accent text-white flex-grow">
            <h3 className="text-2xl font-display font-bold mb-4">نقرأ الأداء لنقود التحسين</h3>
            <p className="text-primary-foreground/80 leading-relaxed text-lg">
              منصة بصير تهدف إلى أتمتة عملية تقييم الأداء المدرسي عبر تحليل الشواهد والمؤشرات باستخدام أحدث تقنيات الذكاء الاصطناعي لضمان الموضوعية والدقة.
            </p>
          </Card>

          <Card className="p-8 border-none shadow-md flex flex-col justify-center items-center text-center bg-card">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Activity className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">حالة النظام</h3>
            <p className="text-muted-foreground">جميع الأنظمة تعمل بكفاءة عالية. الذكاء الاصطناعي جاهز لاستقبال التقييمات الجديدة والفرز الدقيق.</p>
          </Card>
        </div>

        {/* Top 7 Leaderboard */}
        <Card className="p-6 border-none shadow-md flex flex-col bg-card lg:col-span-1 border border-border/50">
          <div className="flex items-center gap-2 mb-6 border-b pb-4">
            <Trophy className="w-6 h-6 text-amber-500" />
            <h3 className="text-xl font-display font-bold text-foreground">لوحة الشرف الكفاءات (أفضل 7)</h3>
          </div>

          <div className="flex flex-col gap-4">
            {topEvaluations.length > 0 ? (
              topEvaluations.map((evalRecord, index) => {
                const tUser = teachers.find(u => u.id === evalRecord.teacherId);
                return (
                  <div key={evalRecord.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-transparent hover:border-primary/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white ${index === 0 ? 'bg-amber-400' : index === 1 ? 'bg-slate-400' : index === 2 ? 'bg-amber-600' : 'bg-primary/80'}`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{tUser?.name || 'معلم مجهول'}</p>
                      </div>
                    </div>
                    <div className="text-primary font-bold bg-primary/10 px-2 py-1 rounded">
                      {evalRecord.totalScore}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">لا يوجد تقييمات منجزة حتى الآن.</p>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
