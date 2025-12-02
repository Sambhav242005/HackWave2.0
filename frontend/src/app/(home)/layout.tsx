import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
    <Header/>
    <div className="p-4">
      {children}
    </div>
    <Footer/>
    </>
  );
}
