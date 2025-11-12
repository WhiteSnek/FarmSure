import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

// Pages and Components
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Crop from "./pages/Crop";
import Fertilizer from "./pages/Fertilizer";
import Yield from "./pages/Yield";
import CropRecommendation from "./pages/cropRecommendation";

const App = () => {
  const { user } = useAuthContext();

  return (
    <div className="App">
      <Navbar />
      <div className="pages">
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!user ? <Signup /> : <Navigate to="/" />}
          />

          {/* Protected routes */}
          <Route
            path="/"
            element={<Home /> }
            //element={user ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/crop"
            element={<Crop />}
            //element={user ? <Crop /> : <Navigate to="/login" />}
          />
          <Route
            path="/fertilizer"
           // element={user ? <Fertilizer /> : <Navigate to="/login" />}
           element={<Fertilizer />}
          />
          <Route
            path="/croprecommendation"
           // element={user ? <Fertilizer /> : <Navigate to="/login" />}
           element={<CropRecommendation />}
          />
          <Route
            path="/yield"
           // element={user ? <Yield /> : <Navigate to="/login" />}
           element={<Yield />}

          />
          <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
