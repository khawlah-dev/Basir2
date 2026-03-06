import logoImg from "@assets/logo_1772817804327.png";
import { 
  Building2, Users, FileText, Activity, 
  BarChart4, Flag, LogOut, Home
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth, useLogout } from "@/hooks/use-auth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { data: user } = useAuth();
  const [location] = useLocation();
  const logout = useLogout();

  if (!user) return null;

  const getMenuByRole = () => {
    switch(user.role) {
      case 'admin':
        return [
          { title: "الرئيسية", url: "/dashboard", icon: Home },
          { title: "إدارة المدارس", url: "/dashboard/schools", icon: Building2 },
          { title: "إدارة المستخدمين", url: "/dashboard/users", icon: Users },
          { title: "الملاحظات (Flags)", url: "/dashboard/flags", icon: Flag },
          { title: "التقييمات", url: "/dashboard/evaluations", icon: BarChart4 },
        ];
      case 'principal':
        return [
          { title: "الرئيسية", url: "/dashboard", icon: Home },
          { title: "معلمي المدرسة", url: "/dashboard/users", icon: Users },
          { title: "اعتماد الشواهد", url: "/dashboard/evidences", icon: FileText },
          { title: "اعتماد المؤشرات", url: "/dashboard/indicators", icon: Activity },
          { title: "الملاحظات (Flags)", url: "/dashboard/flags", icon: Flag },
          { title: "التقييمات", url: "/dashboard/evaluations", icon: BarChart4 },
        ];
      case 'teacher':
        return [
          { title: "الرئيسية", url: "/dashboard", icon: Home },
          { title: "رفع الشواهد", url: "/dashboard/evidences", icon: FileText },
          { title: "رفع المؤشرات", url: "/dashboard/indicators", icon: Activity },
          { title: "تقييماتي", url: "/dashboard/evaluations", icon: BarChart4 },
        ];
      default: return [];
    }
  };

  const items = getMenuByRole();

  return (
    <Sidebar side="right" variant="inset" className="border-s">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center overflow-hidden p-1">
            <img src={logoImg} alt="بصير" className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-primary">بصير</h2>
            <p className="text-xs text-muted-foreground">{user.name}</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 mt-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs mb-2">القائمة الرئيسية</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location === item.url}
                    className="mb-1 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-bold"
                  >
                    <Link href={item.url} className="flex items-center gap-3 py-5">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => logout.mutate()}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors py-5"
            >
              <LogOut className="w-5 h-5 rtl:rotate-180" />
              <span>تسجيل الخروج</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
