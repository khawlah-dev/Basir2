import logoImg from "@assets/logo_1772817804327.png";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Target, Shield, Zap } from "lucide-react";

export function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 end-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 start-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

      {/* Header */}
      <header className="container mx-auto px-6 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-white shadow-sm rounded-xl flex items-center justify-center overflow-hidden p-2">
            <img src={logoImg} alt="بصير" className="w-full h-full object-contain" />
          </div>
          <span className="font-display font-bold text-3xl text-foreground">بصير</span>
        </div>
        <Link href="/login" className="inline-block">
          <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/5 rounded-full px-8 hover-elevate font-bold">
            تسجيل الدخول
          </Button>
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8 py-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 border border-primary/20">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            المنصة الأولى لتقييم الأداء المدرسي بالذكاء الاصطناعي
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-extrabold text-foreground leading-[1.2] md:leading-[1.2]">
            نقرأ الأداء <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">لنقود التحسين</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            منصة متكاملة مصممة خصيصاً لتنظيم جهات التعليم، تبسط عملية رفع الشواهد والمؤشرات، وتستخرج تقييمات موضوعية دقيقة باستخدام أحدث تقنيات الذكاء الاصطناعي.
          </p>

          <div className="pt-8">
            <Link href="/login" className="inline-block">
              <Button size="lg" className="h-16 px-10 text-lg rounded-full shadow-2xl shadow-primary/30 bg-gradient-to-r from-primary to-accent hover:opacity-90 hover-elevate group font-bold text-white">
                ابدأ رحلة التحسين الآن
                <ArrowLeft className="w-5 h-5 ms-3 group-hover:-translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Image / Students Image */}
        <div className="max-w-5xl mx-auto w-full px-6 mb-20 relative z-20">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-primary/10">
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
            <img 
              src="/images/saudi-students.jpg" 
              alt="طلاب سعوديون يدرسون" 
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute bottom-6 start-8 z-20">
              <h3 className="text-white font-bold text-2xl mb-2">بيئة تعليمية متطورة</h3>
              <p className="text-white/80">نعمل معاً لتحسين مخرجات التعلم في المملكة</p>
            </div>
          </div>
        </div>

        {/* Vision & Mission Section */}
        <div className="max-w-6xl mx-auto w-full px-6 py-20 border-y border-primary/5 bg-primary/[0.02] rounded-[3rem] my-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="text-start space-y-6">
              <h2 className="text-4xl font-display font-bold text-primary">رؤيتنا</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                نسعى لتطوير منظومة تعليمية تعتمد على البيانات والذكاء الاصطناعي لرفع كفاءة الأداء المدرسي، وضمان وصول كل مؤسسة تعليمية إلى أقصى طموحاتها في التحسين المستمر.
              </p>
              <div className="flex gap-4 pt-4">
                <div className="p-4 bg-white rounded-2xl shadow-sm border border-primary/10">
                  <h4 className="font-bold text-primary mb-1">الموضوعية</h4>
                  <p className="text-sm text-muted-foreground">تقييم عادل مبني على الشواهد فقط.</p>
                </div>
                <div className="p-4 bg-white rounded-2xl shadow-sm border border-primary/10">
                  <h4 className="font-bold text-primary mb-1">الشفافية</h4>
                  <p className="text-sm text-muted-foreground">وضوح كامل في معايير ونتائج التقييم.</p>
                </div>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-[2rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-white p-2 rounded-[2rem] shadow-2xl border border-primary/5 overflow-hidden aspect-video flex items-center justify-center">
                <img src={logoImg} alt="بصير" className="w-2/3 h-2/3 object-contain animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Features Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-12 pb-24 w-full px-6">
          <div className="bg-card/50 backdrop-blur-sm p-8 rounded-3xl border border-white/50 shadow-xl shadow-black/5 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <Target className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3">دقة وموضوعية</h3>
            <p className="text-muted-foreground leading-relaxed">تقييم آلي يعتمد على معايير واضحة ويحلل الشواهد بدقة عالية بعيداً عن التحيز البشري.</p>
          </div>
          
          <div className="bg-card/50 backdrop-blur-sm p-8 rounded-3xl border border-white/50 shadow-xl shadow-black/5 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3">سرعة الإنجاز</h3>
            <p className="text-muted-foreground leading-relaxed">أتمتة كاملة لدورة التقييم من رفع الملفات حتى استخراج النتيجة النهائية في ثوانٍ معدودة.</p>
          </div>

          <div className="bg-card/50 backdrop-blur-sm p-8 rounded-3xl border border-white/50 shadow-xl shadow-black/5 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
              <Shield className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3">بيئة متكاملة</h3>
            <p className="text-muted-foreground leading-relaxed">لوحات تحكم مخصصة للمدير، قائد المدرسة، والمعلم. تضمن انسيابية العمل وتنظيمه.</p>
          </div>
        </div>

        {/* How it Works Section */}
        <div className="max-w-6xl mx-auto w-full px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-foreground mb-4">كيف يعمل بصير؟</h2>
            <p className="text-muted-foreground">ثلاث خطوات بسيطة تفصلك عن تقرير أداء موضوعي وشامل</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connection Line (Hidden on Mobile) */}
            <div className="hidden md:block absolute top-1/2 start-0 end-0 h-0.5 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 -translate-y-12"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-white shadow-xl border-4 border-primary/20 flex items-center justify-center text-2xl font-black text-primary mb-2">1</div>
              <h4 className="text-xl font-bold">رفع الشواهد</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">يقوم المعلم برفع الصور والوثائق التي تثبت كفاءته في مختلف المعايير الوظيفية.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-white shadow-xl border-4 border-primary/20 flex items-center justify-center text-2xl font-black text-primary mb-2">2</div>
              <h4 className="text-xl font-bold">التحليل الذكي</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">يقوم الذكاء الاصطناعي (Gemini) بقراءة الصور وتحليل الأداء بناءً على المعايير العالمية.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-white shadow-xl border-4 border-primary/20 flex items-center justify-center text-2xl font-black text-primary mb-2">3</div>
              <h4 className="text-xl font-bold">تقرير التحسين</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">يستلم القائد والمعلم تقريراً مفصلاً بالدرجات والملاحظات الموضوعية لقيادة عملية التطوير.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-12 border-t border-primary/10 mt-20 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white shadow-sm rounded-lg flex items-center justify-center overflow-hidden p-1">
                <img src={logoImg} alt="بصير" className="w-full h-full object-contain" />
              </div>
              <span className="font-display font-bold text-xl text-foreground">بصير</span>
            </div>
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} جميع الحقوق محفوظة لمنصة بصير التعليمية.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
