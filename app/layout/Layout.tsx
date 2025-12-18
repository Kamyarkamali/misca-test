import Footer from "./Footer";
import Header from "./Header";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <section className="max-w-[1512.6px] mx-auto">
      <header>
        <Header />
      </header>
      <main className="min-h-screen">{children}</main>
      <footer>
        <Footer />
      </footer>
    </section>
  );
};

export default Layout;
