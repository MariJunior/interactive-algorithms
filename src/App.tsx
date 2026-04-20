import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Learn from "@/pages/Learn";
import Algorithm from "@/pages/Algorithm";
import Sandbox from "@/pages/Sandbox";
import Layout from "./components/Layout";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/algorithm/:slug" element={<Algorithm />} />
        <Route path="/sandbox" element={<Sandbox />} />
      </Route>
    </Routes>
  );
}
