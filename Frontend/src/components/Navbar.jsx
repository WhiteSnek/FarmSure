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
        padding: 14px 32px;
        background-color: #ffffff;
        border-bottom: 1px solid #e5e7eb;
        box-shadow: 0 2px 6px rgba(0,0,0,0.05);
        position: sticky;
        top: 0;
        z-index: 999;
      }

      .navbar-left {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .logo {
        height: 42px;
        width: auto;
      }

      .navbar h1 {
        font-size: 22px;
        font-weight: 700;
        color: #2d6a4f;
        margin: 0;
      }

      /* NAV LINKS */
      .navbar-links {
        display: flex;
        gap: 32px; /* reduced from 80px */
        padding: 8px 20px;
      }

      .navbar-links a {
        text-decoration: none;
        color: #374151;
        font-weight: 550;
        font-size: 15px;
        padding: 6px 10px;
        border-radius: 6px;
        transition: 0.25s ease;
      }

      .navbar-links a:hover {
        background: #e6f4ea;
        color: #2d6a4f;
      }

      .navbar-right {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      /* LANG BUTTONS */
      .navbar-right button {
        padding: 6px 10px;
        border: 1px solid #cbd5e1;
        background: #f8fafc;
        border-radius: 6px;
        font-weight: 500;
        cursor: pointer;
        transition: 0.25s ease;
      }

      .navbar-right button:hover {
        background: #e2e8f0;
      }

      /* LOGOUT BUTTON */
      .logout-btn {
        background-color: #2d6a4f !important;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
        box-shadow: 0 2px 4px rgba(0,0,0,0.15);
      }

      .logout-btn:hover {
        background-color: #1b4332 !important;
      }
    `}</style>

    </>
  );
};

export default Navbar;
