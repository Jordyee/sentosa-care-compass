import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Calendar, 
  Pill, 
  FileText, 
  Activity,
  LogOut,
  Stethoscope
} from "lucide-react";

export default function Dashboard() {
  const { user, userRole, signOut } = useAuth();

  const getDashboardContent = () => {
    switch (userRole) {
      case "admin":
        return {
          title: "Dashboard Admin",
          description: "Kelola pendaftaran, pembayaran, dan laporan",
          cards: [
            { title: "Pendaftaran Pasien", icon: Users, link: "/admin/registration" },
            { title: "Antrian Pasien", icon: Calendar, link: "/admin/queue" },
            { title: "Pembayaran", icon: FileText, link: "/admin/payments" },
            { title: "Laporan", icon: Activity, link: "/admin/reports" },
          ],
        };
      case "perawat":
        return {
          title: "Dashboard Perawat",
          description: "Pemeriksaan awal pasien",
          cards: [
            { title: "Antrian Pasien", icon: Calendar, link: "/nurse/queue" },
            { title: "Pemeriksaan Awal", icon: Activity, link: "/nurse/examination" },
          ],
        };
      case "dokter":
        return {
          title: "Dashboard Dokter",
          description: "Konsultasi dan diagnosa pasien",
          cards: [
            { title: "Antrian Pasien", icon: Calendar, link: "/doctor/queue" },
            { title: "Konsultasi", icon: Stethoscope, link: "/doctor/consultation" },
            { title: "Riwayat Medis", icon: FileText, link: "/doctor/history" },
          ],
        };
      case "apotek":
        return {
          title: "Dashboard Apotek",
          description: "Kelola obat dan resep",
          cards: [
            { title: "Antrian Resep", icon: FileText, link: "/pharmacy/prescriptions" },
            { title: "Kelola Obat", icon: Pill, link: "/pharmacy/medicines" },
            { title: "Stok Obat", icon: Activity, link: "/pharmacy/stock" },
          ],
        };
      case "pemilik":
        return {
          title: "Dashboard Pemilik",
          description: "Lihat laporan dan statistik klinik",
          cards: [
            { title: "Laporan Harian", icon: FileText, link: "/owner/daily-reports" },
            { title: "Laporan Bulanan", icon: Activity, link: "/owner/monthly-reports" },
            { title: "Statistik", icon: Users, link: "/owner/statistics" },
          ],
        };
      default:
        return {
          title: "Dashboard",
          description: "Selamat datang",
          cards: [],
        };
    }
  };

  const content = getDashboardContent();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card shadow-card-hover border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Klinik Sentosa</h1>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Button onClick={signOut} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">{content.title}</h2>
          <p className="text-muted-foreground">{content.description}</p>
          <div className="mt-2 inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            Role: {userRole}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card
                key={index}
                className="hover:shadow-elegant transition-all duration-300 cursor-pointer group"
                onClick={() => window.location.href = card.link}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-gradient-primary rounded-lg group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-lg mb-1">{card.title}</CardTitle>
                  <CardDescription>Klik untuk mengakses</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {content.cards.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Anda belum memiliki role yang aktif. Silakan hubungi administrator.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
