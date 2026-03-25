import Welcome from "./components/Welcome";
import Login from "./components/Login";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cadastro from "./components/Cadastro";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
