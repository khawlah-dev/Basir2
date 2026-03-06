import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Activity, BarChart4, FileText, Users } from "lucide-react";

export function DashboardHome() {
  const { data: user } = useAuth();

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

  const stats = [
    { title: "الشواهد المرفوعة", value: "24", icon: FileText, color: "text-blue-500", bg: "bg-blue-50" },
    { title: "المؤشرات المعتمدة", value: "12", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-50" },
    { title: "التقييمات المنجزة", value: "3", icon: BarChart4, color: "text-purple-500", bg: "bg-purple-50" },
    { title: "المعلمين", value: "45", icon: Users, color: "text-amber-500", bg: "bg-amber-50" },
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

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-8 border-none shadow-md bg-gradient-to-br from-primary to-accent text-white">
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
          <p className="text-muted-foreground">جميع الأنظمة تعمل بكفاءة عالية. الذكاء الاصطناعي جاهز لاستقبال التقييمات الجديدة.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
