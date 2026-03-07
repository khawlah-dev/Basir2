import logoImg from "@assets/logo_1772817804327.png";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Target, Shield, Zap, Sparkles, Building2, Workflow } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Landing() {
  return (
    <div className="min-h-screen mesh-bg flex flex-col font-sans relative overflow-hidden transition-colors duration-1000">

      {/* Decorative Blur Backgrounds for Depth */}
      <div className="absolute top-[-10%] start-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none float-slow"></div>
      <div className="absolute bottom-[-20%] end-[-10%] w-[600px] h-[600px] bg-accent/20 rounded-full blur-[150px] pointer-events-none float-slow delay-200"></div>

      {/* Floating Header */}
      <div className="fixed top-0 left-0 right-0 z-50 pt-6 px-6 reveal-animation">
        <header className="container mx-auto max-w-7xl glass rounded-full px-6 py-4 flex justify-between items-center shadow-lg border-white/20 dark:border-white/10 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white shadow-sm rounded-full flex items-center justify-center overflow-hidden p-2">
              <img src={logoImg} alt="بصير" className="w-full h-full object-contain" />
            </div>
            <span className="font-display font-bold text-2xl text-foreground tracking-tight">بصير</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login" className="inline-block">
              <Button variant="default" className="rounded-full px-8 py-6 font-bold shadow-lg shadow-primary/25 hover-elevate transition-all duration-300 bg-foreground text-background hover:bg-primary hover:text-white">
                تسجيل الدخول
              </Button>
            </Link>
          </div>
        </header>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center pt-32 md:pt-48 px-4 relative z-10 w-full mb-32">

        {/* Futuristic Hero Section */}
        <section className="max-w-5xl mx-auto text-center space-y-8 w-full">
          <div className="reveal-animation inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-primary/20 text-primary font-bold text-sm shadow-sm hover:-translate-y-1 transition-transform cursor-default">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            منصة الجيل القادم لتقييم الأداء بالذكاء الاصطناعي
          </div>

          <h1 className="reveal-animation delay-100 text-6xl md:text-8xl lg:text-[7rem] font-display font-black text-foreground leading-[1.1] md:leading-[1.1] tracking-tighter">
            ارتقِ بالأداء <br />
            <span className="premium-gradient-text">لآفاق جديدة</span>
          </h1>

          <p className="reveal-animation delay-200 text-lg md:text-2xl text-muted-foreground/90 max-w-2xl mx-auto leading-relaxed text-balance">
            بصير هي بيئتك الرقمية الذكية. تقييم موضوعي وشامل للمدارس والمعلمين، يُدار بالكامل بتقنيات الذكاء الاصطناعي بدقة وأمان.
          </p>

          <div className="reveal-animation delay-300 pt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/login" className="inline-block w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-16 px-10 text-lg rounded-full shadow-2xl shadow-primary/40 bg-primary hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all duration-300 group font-bold text-white">
                ابدأ رحلة التحسين
                <ArrowLeft className="w-5 h-5 ms-3 group-hover:-translate-x-2 transition-transform duration-300" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto h-16 px-10 text-lg rounded-full glass border-foreground/10 hover:bg-foreground/5 shadow-none hover-elevate transition-all duration-300 font-bold text-foreground"
              onClick={() => {
                document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              تعرف على النظام
            </Button>
          </div>
        </section>

        {/* Floating Creative Image Showcase */}
        <section className="max-w-6xl mx-auto w-full px-6 mt-32 mb-40 relative z-20 reveal-animation delay-300">
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white/20 dark:border-white/5 group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 transition-opacity duration-500"></div>
            <img
              src="/images/saudi-students.jpg"
              alt="بيئة تعليمية"
              className="w-full h-[500px] md:h-[600px] object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
            <div className="absolute bottom-0 start-0 p-10 md:p-14 z-20 w-full">
              <div className="glass inline-block px-6 py-3 rounded-2xl mb-4 text-white">
                <span className="font-bold text-sm tracking-wide uppercase">رؤية السعودية 2030</span>
              </div>
              <h3 className="text-white font-display font-black text-4xl md:text-5xl mb-4 leading-tight">مستقبل التعليم يُصنع اليوم</h3>
              <p className="text-white/80 text-lg max-w-xl leading-relaxed">منصة بصير تمكّن الكفاءات الوطنية عبر توفير بيانات شفافة ورؤى دقيقة لقيادة التطوير المدرسي المستدام.</p>
            </div>
          </div>
        </section>

        {/* Bento Grid Features (Non-traditional Layout) */}
        <section id="features-section" className="max-w-7xl mx-auto w-full px-6 py-20 scroll-mt-24">
          <div className="text-center mb-20 reveal-animation">
            <h2 className="text-5xl md:text-6xl font-display font-black text-foreground mb-6">تجربة لا مثيل لها</h2>
            <p className="text-xl text-muted-foreground">صُمم كل تفصيل في بصير لتسهيل عملك وجعله أكثر إلهاماً.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
            {/* Large Card */}
            <div className="lg:col-span-2 glass-card p-10 min-h-[300px] flex flex-col justify-end group hover-elevate relative z-10">
              <div className="absolute top-8 start-8 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg">
                <Target className="w-8 h-8" />
              </div>
              <div className="mt-16">
                <h3 className="text-3xl font-bold font-display text-foreground mb-4">دقة متناهية بالذكاء الاصطناعي</h3>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-md">نظام التحليل الآلي يقيم الشواهد بدقة وموضوعية تامة استناداً لمعايير الاعتماد المدرسي، مما يلغي التحيز البشري تماماً.</p>
              </div>
            </div>

            {/* Tall Vertical Card */}
            <div className="lg:row-span-2 glass-card p-10 min-h-[300px] flex flex-col justify-start group hover-elevate relative z-10">
              <div className="w-16 h-16 mb-8 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center shadow-lg mx-auto lg:mx-0">
                <Shield className="w-8 h-8" />
              </div>
              <div className="mt-auto lg:mt-0 text-center lg:text-start">
                <h3 className="text-2xl font-bold font-display text-foreground mb-4 lg:mt-8">أمان تام</h3>
                <p className="text-muted-foreground leading-relaxed">بيانات المدارس والمعلمين وملفات الشواهد مشفرة ومحفوظة بأعلى درجات الأمان المعتمدة محلياً وعالمياً.</p>
              </div>
            </div>

            {/* Medium Card */}
            <div className="md:col-span-2 lg:col-span-2 glass-card p-10 min-h-[250px] flex flex-col sm:flex-row items-center justify-between gap-8 group hover-elevate relative overflow-hidden z-10">
              <div className="absolute -end-12 -bottom-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors duration-500 pointer-events-none"></div>

              <div className="flex-1 relative z-20 text-center sm:text-start">
                <div className="w-14 h-14 mb-6 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center shadow-lg mx-auto sm:mx-0">
                  <Zap className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold font-display text-foreground mb-3">سرعة الإنجاز</h3>
                <p className="text-muted-foreground leading-relaxed md:max-w-md">أتمتة كاملة لدورة التقييم من الرفع للمنصة، حتى استخراج النتيجة النهائية في ثوانٍ معدودة.</p>
              </div>
            </div>

            {/* Small Full Width Card */}
            <div className="md:col-span-2 lg:col-span-3 glass-card p-10 min-h-[200px] flex flex-col sm:flex-row items-center sm:justify-between gap-8 group hover-elevate relative z-10 mt-2">
              <div className="flex-1 order-2 sm:order-1 text-center sm:text-start">
                <h3 className="text-3xl font-bold font-display text-foreground mb-4">بيئة شاملة للقطاع التعليمي</h3>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">لوحات تحكم ذكية ومخصصة للمدير، وقائد المدرسة، والمعلم. تضمن انسيابية العمل وتنظيمه عبر التسلسل الإداري الصحيح.</p>
              </div>
              <div className="w-24 h-24 shrink-0 rounded-[2rem] bg-gradient-to-tr from-foreground to-foreground/80 flex items-center justify-center text-background shadow-2xl group-hover:rotate-12 transition-transform duration-500 order-1 sm:order-2 mb-6 sm:mb-0">
                <Building2 className="w-12 h-12" />
              </div>
            </div>
          </div>
        </section>

        {/* Workflow / Steps Section */}
        <section className="w-full max-w-6xl mx-auto py-32 px-6">
          <div className="glass-card p-12 md:p-20 relative overflow-hidden text-center">
            {/* Interactive Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none"></div>

            <Workflow className="w-16 h-16 mx-auto mb-8 text-primary opacity-80" />
            <h2 className="text-4xl md:text-5xl font-display font-black text-foreground mb-6">رحلة مبسطة لتقييم عادل</h2>
            <p className="text-xl text-muted-foreground mb-16 max-w-2xl mx-auto">صممنا سير العمل ليكون تجربة سلسة لا تتطلب أي مجهود إضافي من الإدارة المدرسية.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10 text-start">
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-full bg-white/60 dark:bg-black/40 backdrop-blur-md shadow-xl border border-white/20 flex items-center justify-center text-2xl font-black text-foreground">1</div>
                <h4 className="text-2xl font-bold">رفع الشواهد</h4>
                <p className="text-muted-foreground leading-relaxed text-balance">يرفع المعلم الوثائق والصور التي تثبت كفاءته في معايير التقييم ضمن لوحة تحكمه الخاصة.</p>
              </div>
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-full bg-white/60 dark:bg-black/40 backdrop-blur-md shadow-xl border border-white/20 flex items-center justify-center text-2xl font-black text-foreground">2</div>
                <h4 className="text-2xl font-bold">التحليل الذكي</h4>
                <p className="text-muted-foreground leading-relaxed text-balance">يقرأ محرك الذكاء الاصطناعي الصور ويقيس الأداء بناءً على المعايير العالمية بدقة شديدة.</p>
              </div>
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/30 flex items-center justify-center text-2xl font-black">3</div>
                <h4 className="text-2xl font-bold">تقرير شامل</h4>
                <p className="text-muted-foreground leading-relaxed text-balance">يتم استخراج تقرير مفصل بنقاط القوة وفرص التحسين للمدير وقائد المدرسة.</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 pb-12 pt-20 px-6 mt-auto glass bg-transparent relative z-20">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center overflow-hidden p-1">
                <img src={logoImg} alt="بصير" className="w-full h-full object-contain" />
              </div>
              <span className="font-display font-bold text-2xl text-foreground">بصير</span>
            </div>
            <p className="text-muted-foreground font-medium">© {new Date().getFullYear()} جميع الحقوق محفوظة. مُصمم بعناية للتعليم.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
