import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import logo from '../assets/logo.png';
import { useLogout } from '../hooks/useLogout';
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Sparkles, X, Send } from "lucide-react";

const Navbar = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const { t, i18n } = useTranslation();
  const [showAIModal, setShowAIModal] = useState(false);
  const [query, setQuery] = useState("");
  const [state, setState] = useState("");
  const [language, setLanguage] = useState("english");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    logout();
  };

  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
  };

  const handleAISubmit = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setResponse("");

    try {
      const apiResponse = await fetch(`${import.meta.env.VITE_CHATBOT_URI}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: language,
          state: state || "general",
          query: query,
        }),
      });

      const data = await apiResponse.json();
      console.log(data);
      
      
      setResponse(data.answer);
    } catch (error) {
      setResponse("Error: Unable to get response. Please try again.");
      console.error("AI API error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="FarmSure Logo" className="logo" />
          <h1>{t("appName")}</h1>
          
          {/* AI Assistant Icon */}
          <button 
            className="ai-icon-btn"
            onClick={() => setShowAIModal(true)}
            title="AI Farming Assistant"
          >
            <Sparkles size={20} />
          </button>
        </div>

        <div className="navbar-links">
          <Link to="/">{t("home")}</Link>
          <Link to="/crop">{t("Disease")}</Link>
          <Link to="/croprecommendation">{t("cropRecommendation")}</Link>
          <Link to="/fertilizer">{t("fertilizer")}</Link>
          <Link to="/yield">{t("yield")}</Link>
          <Link to="/price-predict">{t("pricePredict")}</Link>
        </div>

        <div className="navbar-right">
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

      {/* AI Assistant Modal */}
      {showAIModal && (
        <div className="modal-overlay" onClick={() => setShowAIModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Sparkles size={24} color="#2d6a4f" />
                <h2>AI Farming Assistant</h2>
              </div>
              <button className="close-btn" onClick={() => setShowAIModal(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              <div className="input-group">
                <label>Your Query</label>
                <textarea
                  placeholder="Ask anything about farming..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label>State (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., Punjab, Maharashtra"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>


              </div>

              <button 
                className="submit-btn" 
                onClick={handleAISubmit}
                disabled={loading || !query.trim()}
              >
                {loading ? (
                  "Getting Answer..."
                ) : (
                  <>
                    <Send size={18} />
                    Ask AI
                  </>
                )}
              </button>

              {response && (
                <div className="response-box">
                  <h3>AI Response:</h3>
                  <p>{response}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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

        .ai-icon-btn {
          background: linear-gradient(135deg, #2d6a4f 0%, #40916c 100%);
          border: none;
          padding: 8px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(45, 106, 79, 0.3);
        }

        .ai-icon-btn svg {
          color: white;
        }

        .ai-icon-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(45, 106, 79, 0.4);
        }

        .navbar-links {
          display: flex;
          gap: 32px;
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

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          width: 60vw;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 24px;
          color: #2d6a4f;
        }

        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          transition: 0.2s;
        }

        .close-btn:hover {
          background: #f3f4f6;
        }

        .modal-body {
          padding: 24px;
        }

        .input-group {
          margin-bottom: 20px;
        }

        .input-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #374151;
          font-size: 14px;
        }

        .input-group input,
        .input-group textarea,
        .input-group select {
          width: 100%;
          padding: 12px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 15px;
          transition: 0.2s;
          font-family: inherit;
        }

        .input-group input:focus,
        .input-group textarea:focus,
        .input-group select:focus {
          outline: none;
          border-color: #2d6a4f;
        }

        .input-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .submit-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #2d6a4f 0%, #40916c 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: 0.3s;
          margin-top: 24px;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(45, 106, 79, 0.4);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .response-box {
          margin-top: 24px;
          padding: 20px;
          background: #f8faf9;
          border: 2px solid #d1fae5;
          border-radius: 12px;
        }

        .response-box h3 {
          margin: 0 0 12px 0;
          color: #2d6a4f;
          font-size: 18px;
        }

        .response-box p {
          margin: 0;
          color: #374151;
          line-height: 1.6;
          white-space: pre-wrap;
        }

        @media (max-width: 768px) {
          .modal-content {
            width: 90vw;
            max-height: 85vh;
          }

          .input-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;