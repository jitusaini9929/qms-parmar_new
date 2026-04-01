import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function StudentDashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      <Header />
        {children}
      <Footer />
    </div>
  );
}
