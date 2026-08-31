import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Jobs from "./pages/JobListings";
import Internships from "./pages/Internships";
import About from "./pages/About";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route
          path="/internships"
          element={<Internships />}
        />
        <Route path="/about" element={<About />} />
      </Routes>

      <footer>
        <p>© 2026 CareerConnect. All rights reserved.</p>
      </footer>
    </BrowserRouter>
  );
}

export default App;