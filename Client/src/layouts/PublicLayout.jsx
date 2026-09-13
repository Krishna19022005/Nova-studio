import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";

function PublicLayout() {
  return (
    <div className="nova-site">
      <Navbar />

      <main>
        <Outlet />
      </main>

      <WhatsAppButton />

      <Footer />
    </div>
  );
}

export default PublicLayout;