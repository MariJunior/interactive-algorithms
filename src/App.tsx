import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Learn from "@/pages/Learn";
import Algorithm from "@/pages/Algorithm";
import Sandbox from "@/pages/Sandbox";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/learn" element={<Learn />} />
      <Route path="/algorithm/:slug" element={<Algorithm />} />
      <Route path="/sandbox" element={<Sandbox />} />
    </Routes>
  );
}
