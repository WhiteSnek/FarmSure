import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import logo from '../assets/logo.png';
import { useLogout } from '../hooks/useLogout';

const Navbar = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();

  const handleClick = () => {
    logout();
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="FarmSure Logo" className="logo" />
          <h1>FarmSure</h1>
        </div>

        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/crop">Crop</Link>
          <Link to="/fertilizer">Fertilizer</Link>
          <Link to="/yield">Yield</Link>
        </div>

        <div className="navbar-right">
          {user && (
            <button className="logout-btn" onClick={handleClick}>
              Logout
            </button>
          )}
        </div>
      </nav>

      <style>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 24px;
          background-color: #ffffff;
          border-bottom: 2px solid #eaeaea;
        }

        .navbar-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo {
          height: 40px;
          width: auto;
        }

        .navbar h1 {
          font-size: 20px;
          font-weight: bold;
          color: #2d6a4f;
          margin: 0;
        }

        .navbar-links {
          display: flex;
          gap: 20px;
          padding: 8px 20px;
        }

        .navbar-links a {
          text-decoration: none;
          color: #333;
          font-weight: 500;
          transition: color 0.2s ease-in-out;
        }

        .navbar-links a:hover {
          color: #2d6a4f;
        }

        .navbar-right {
          display: flex;
          align-items: center;
        }

        .logout-btn {
          background-color: #2d6a4f;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }

        .logout-btn:hover {
          background-color: #1b4332;
        }
      `}</style>
    </>
  );
};

export default Navbar;
