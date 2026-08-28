import ScrollToTop from "@/components/ScrollToTop";
import Algorithm from "@/pages/Algorithm";
import Home from "@/pages/Home";
import Learn from "@/pages/Learn";
import Sandbox from "@/pages/Sandbox";
import { Analytics } from "@vercel/analytics/react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/algorithm/:slug" element={<Algorithm />} />
          <Route path="/sandbox" element={<Sandbox />} />
        </Route>
      </Routes>
      <Analytics />
    </>
  );
}
