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
import SchemesPage from "./pages/Schemes";
import PricePredict from "./pages/PricePredict";

const App = () => {
  const { user } = useAuthContext();

  return (
    <div className="App">
      {/* <Navbar /> */}
      <div className="pages">
        <Navbar/>
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
            element={<Fertilizer />}
           //element={user ? <Fertilizer /> : <Navigate to="/login" />}
          />


          <Route
            path="/croprecommendation"
            element={<CropRecommendation/>}
           //element={user ? <CropRecommendation/> : <Navigate to="/login" />}
          />

          <Route
            path="/yield"
            element={<Yield />}
            //element={user ? <Yield /> : <Navigate to="/login" />}

          />

          <Route
            path="/schemes"
            element={<SchemesPage/>}
            //element={user ? <SchemesPage/>: <Navigate to="/login" />}

          />

          <Route
            path="/price-predict"
            element={<PricePredict/>}
            //element={user ? <PricePredict/>: <Navigate to="/login" />}

          />
          
          <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
