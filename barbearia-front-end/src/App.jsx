import Welcome from "./components/jsx/Welcome";
import Login from "./components/jsx/Login";
import Cadastro from "./components/jsx/Cadastro";
import HomePage from "./components/jsx/HomePage"
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/homePage" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
