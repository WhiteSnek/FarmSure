import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import logo from '../assets/logo.png';
import { useLogout } from '../hooks/useLogout';
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const { t, i18n } = useTranslation();

  const handleClick = () => {
    logout();
  };

  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="FarmSure Logo" className="logo" />
          <h1>{t("appName")}</h1>
        </div>

        <div className="navbar-links">
          <Link to="/">{t("home")}</Link>
          <Link to="/crop">{t("crop")}</Link>
          <Link to="/croprecommendation">{t("cropRecommendation")}</Link>
          <Link to="/fertilizer">{t("fertilizer")}</Link>
          <Link to="/yield">{t("yield")}</Link>
        </div>

        <div className="navbar-right">
          {/* Language Switch */}
          <div style={{ display: "flex", gap: "8px", marginRight: "14px" }}>
            <button onClick={() => changeLang("en")}>EN</button>
            <button onClick={() => changeLang("hi")}>HI</button>
          </div>

          {user && (
            <button className="logout-btn" onClick={handleClick}>
              {t("logout")}
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
          gap: 80px;
          padding: 8px 40px;
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
