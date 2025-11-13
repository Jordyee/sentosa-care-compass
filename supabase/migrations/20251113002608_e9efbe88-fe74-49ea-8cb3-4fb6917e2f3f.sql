-- ============================================================================
-- SISTEM INFORMASI KLINIK SENTOSA - DATABASE SCHEMA
-- ============================================================================

-- Create ENUM types
CREATE TYPE app_role AS ENUM ('admin', 'dokter', 'perawat', 'apotek', 'pemilik');
CREATE TYPE visit_status AS ENUM ('menunggu', 'pemeriksaan_awal', 'konsultasi', 'apotek', 'selesai', 'batal');
CREATE TYPE prescription_status AS ENUM ('menunggu', 'diproses', 'selesai');

-- ============================================================================
-- TABLE: profiles (User Profiles)
-- ============================================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nama TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: user_roles (Role Management)
-- ============================================================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- ============================================================================
-- TABLE: patients (Data Pasien)
-- ============================================================================
CREATE TABLE public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama TEXT NOT NULL,
  alamat TEXT NOT NULL,
  no_telp TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: visits (Kunjungan Pasien)
-- ============================================================================
CREATE TABLE public.visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES public.profiles(id),
  tgl_visit TIMESTAMPTZ DEFAULT NOW(),
  status visit_status DEFAULT 'menunggu',
  keluhan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: medical_records (Rekam Medis)
-- ============================================================================
CREATE TABLE public.medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID NOT NULL REFERENCES public.visits(id) ON DELETE CASCADE UNIQUE,
  perawat_id UUID REFERENCES public.profiles(id),
  dokter_id UUID REFERENCES public.profiles(id),
  tinggi_badan DECIMAL(5,2),
  berat_badan DECIMAL(5,2),
  tensi_darah TEXT,
  hasil_pemeriksaan TEXT,
  catatan_dokter TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: medicines (Data Obat)
-- ============================================================================
CREATE TABLE public.medicines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_obat TEXT NOT NULL UNIQUE,
  stok_sisa INTEGER NOT NULL DEFAULT 0 CHECK (stok_sisa >= 0),
  harga_satuan DECIMAL(10,2) NOT NULL CHECK (harga_satuan >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: prescriptions (Resep)
-- ============================================================================
CREATE TABLE public.prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medical_record_id UUID NOT NULL REFERENCES public.medical_records(id) ON DELETE CASCADE,
  apotek_id UUID REFERENCES public.profiles(id),
  status prescription_status DEFAULT 'menunggu',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: prescription_details (Detail Resep)
-- ============================================================================
CREATE TABLE public.prescription_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id UUID NOT NULL REFERENCES public.prescriptions(id) ON DELETE CASCADE,
  medicine_id UUID NOT NULL REFERENCES public.medicines(id),
  jumlah INTEGER NOT NULL CHECK (jumlah > 0),
  dosis TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: payments (Pembayaran)
-- ============================================================================
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID NOT NULL REFERENCES public.visits(id) ON DELETE CASCADE UNIQUE,
  admin_id UUID REFERENCES public.profiles(id),
  biaya_pemeriksaan DECIMAL(10,2) NOT NULL DEFAULT 0,
  biaya_obat DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_bayar DECIMAL(10,2) NOT NULL,
  no_struk TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: reports (Laporan)
-- ============================================================================
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pemilik_id UUID REFERENCES public.profiles(id),
  tgl_laporan DATE NOT NULL,
  tipe TEXT NOT NULL CHECK (tipe IN ('harian', 'bulanan')),
  total_pasien INTEGER DEFAULT 0,
  total_pendapatan DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- FUNCTIONS: Security Definer Function for Role Check
-- ============================================================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- ============================================================================
-- FUNCTIONS: Auto-create profile on signup
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nama, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nama', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email)
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- FUNCTIONS: Update timestamp triggers
-- ============================================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON public.patients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_visits_updated_at BEFORE UPDATE ON public.visits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medical_records_updated_at BEFORE UPDATE ON public.medical_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medicines_updated_at BEFORE UPDATE ON public.medicines
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_prescriptions_updated_at BEFORE UPDATE ON public.prescriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescription_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- User Roles: Users can view their own roles
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can manage roles
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Patients: Accessible by authenticated staff
CREATE POLICY "Staff can view patients" ON public.patients
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin can manage patients" ON public.patients
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Visits: Accessible by authenticated staff
CREATE POLICY "Staff can view visits" ON public.visits
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin and Perawat can create visits" ON public.visits
  FOR INSERT WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'perawat')
  );

CREATE POLICY "Admin and Dokter can update visits" ON public.visits
  FOR UPDATE USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'dokter') OR
    public.has_role(auth.uid(), 'perawat')
  );

-- Medical Records: Accessible by medical staff
CREATE POLICY "Medical staff can view records" ON public.medical_records
  FOR SELECT USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'dokter') OR
    public.has_role(auth.uid(), 'perawat')
  );

CREATE POLICY "Medical staff can create records" ON public.medical_records
  FOR INSERT WITH CHECK (
    public.has_role(auth.uid(), 'dokter') OR
    public.has_role(auth.uid(), 'perawat')
  );

CREATE POLICY "Medical staff can update records" ON public.medical_records
  FOR UPDATE USING (
    public.has_role(auth.uid(), 'dokter') OR
    public.has_role(auth.uid(), 'perawat')
  );

-- Medicines: Accessible by staff
CREATE POLICY "Staff can view medicines" ON public.medicines
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Apotek can manage medicines" ON public.medicines
  FOR ALL USING (public.has_role(auth.uid(), 'apotek'));

-- Prescriptions: Accessible by medical and pharmacy staff
CREATE POLICY "Medical and Apotek can view prescriptions" ON public.prescriptions
  FOR SELECT USING (
    public.has_role(auth.uid(), 'dokter') OR
    public.has_role(auth.uid(), 'apotek') OR
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Dokter can create prescriptions" ON public.prescriptions
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'dokter'));

CREATE POLICY "Apotek can update prescriptions" ON public.prescriptions
  FOR UPDATE USING (public.has_role(auth.uid(), 'apotek'));

-- Prescription Details: Same as prescriptions
CREATE POLICY "Medical and Apotek can view prescription details" ON public.prescription_details
  FOR SELECT USING (
    public.has_role(auth.uid(), 'dokter') OR
    public.has_role(auth.uid(), 'apotek') OR
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Dokter can create prescription details" ON public.prescription_details
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'dokter'));

-- Payments: Admin only
CREATE POLICY "Admin can manage payments" ON public.payments
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can view payments" ON public.payments
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Reports: Pemilik and Admin can view
CREATE POLICY "Pemilik and Admin can view reports" ON public.reports
  FOR SELECT USING (
    public.has_role(auth.uid(), 'pemilik') OR
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admin can create reports" ON public.reports
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- INDEXES for Performance
-- ============================================================================
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_visits_patient_id ON public.visits(patient_id);
CREATE INDEX idx_visits_status ON public.visits(status);
CREATE INDEX idx_medical_records_visit_id ON public.medical_records(visit_id);
CREATE INDEX idx_prescriptions_medical_record_id ON public.prescriptions(medical_record_id);
CREATE INDEX idx_prescription_details_prescription_id ON public.prescription_details(prescription_id);
CREATE INDEX idx_payments_visit_id ON public.payments(visit_id);
CREATE INDEX idx_reports_tgl_laporan ON public.reports(tgl_laporan);