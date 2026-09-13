import { Routes, Route } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";

import Home from "./pages/Home";
import Collections from "./pages/Collections";
import CollectionDetail from "./pages/CollectionDetail";
import ProductDetail from "./pages/ProductDetail";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Materials from "./pages/Materials";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import AdminProjects from "./pages/AdminProjects";
import AdminAddProject from "./pages/AdminAddProject";
import AdminCollections from "./pages/AdminCollections";
import AdminAddCollection from './pages/AdminAddCollection'
import AdminCollectionProducts from "./pages/AdminCollectionProducts";
import AdminAddProduct from "./pages/AdminAddProduct";
import AdminInquiries from "./pages/AdminInquires";
import ProtectedAdminRoute from "./components/ProtectedAdminRoutes";
function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />

        <Route
          path="/collections"
          element={<Collections />}
        />

        <Route
          path="/collections/:slug"
          element={<CollectionDetail />}
        />

        <Route
          path="/products/:slug"
          element={<ProductDetail />}
        />

        <Route path="/projects" element={<Projects />} />

        <Route
          path="/projects/:slug"
          element={<ProjectDetail />}
        />

        <Route
          path="/materials"
          element={<Materials/>}
        />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* admin routes */}
      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route
        path="/admin/projects"
        element={<AdminProjects />}
      />
      <Route
        path="/admin/projects/add"
        element={<AdminAddProject />}
      />
      <Route
        path="/admin/collections"
        element={<AdminCollections />}
      />
      <Route
        path="/admin/collections/add"
        element={<AdminAddCollection />}
      />
      <Route
        path="/admin/collections/:id"
        element={<AdminCollectionProducts />}
      />
      <Route
      path="/admin/collections/:id/products/add"
      element={<AdminAddProduct />}
    />
    <Route
      path="/admin/inquiries"
      element={<AdminInquiries />}
    />
    </Routes>
  );
}

export default App;