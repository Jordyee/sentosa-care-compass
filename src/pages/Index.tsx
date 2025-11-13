import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Stethoscope, Activity, Users, Shield } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            <div className="flex justify-center">
              <div className="p-6 bg-gradient-primary rounded-3xl shadow-elegant">
                <Stethoscope className="w-20 h-20 text-white" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground">
                Klinik Sentosa
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                Sistem Informasi Klinik Modern untuk Pengelolaan Pasien yang Efisien
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button 
                size="lg" 
                onClick={() => navigate("/auth")}
                className="text-lg px-8"
              >
                Login / Daftar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Fitur Unggulan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Users className="w-10 h-10" />}
            title="Manajemen Pasien"
            description="Kelola data pasien dengan mudah, dari pendaftaran hingga riwayat medis lengkap"
          />
          <FeatureCard
            icon={<Activity className="w-10 h-10" />}
            title="Alur Kerja Efisien"
            description="Sistem terintegrasi untuk admin, perawat, dokter, dan apotek"
          />
          <FeatureCard
            icon={<Shield className="w-10 h-10" />}
            title="Keamanan Data"
            description="Proteksi data pasien dengan sistem keamanan berlapis"
          />
        </div>
      </div>
    </div>
  );
};

function FeatureCard({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <div className="bg-card p-8 rounded-2xl shadow-card-hover hover:shadow-elegant transition-all duration-300 border">
      <div className="flex justify-center mb-4 text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-center mb-3">{title}</h3>
      <p className="text-muted-foreground text-center">{description}</p>
    </div>
  );
}

export default Index;
