import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Pages/Layout";
import Home from "./Pages/Home";
import Register from "./Pages/Auth/Register";
import Login from "./Pages/Auth/Login";
import Create from "./Pages/Posts/Create";
import Show from "./Pages/Posts/Show";
import Update from "./Pages/Posts/Update";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="create" element={<Create />} />
          <Route path="posts/:id" element={<Show />} />
          <Route path="posts/update/:id" element={<Update />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
