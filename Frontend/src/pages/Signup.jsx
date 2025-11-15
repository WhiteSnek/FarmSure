import { useState } from "react";
import { User, Mail, Phone, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Signup = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    contact: "",
    password: "",
  });
  const [focusedField, setFocusedField] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");

    setTimeout(() => {
      if (formData.username && formData.email && formData.contact && formData.password) {
        alert(t("signup_success")); // Translated
        setIsLoading(false);
      } else {
        setError(t("fill_all_fields")); // Translated
        setIsLoading(false);
      }
    }, 1500);
  };

  const isFormValid = () => {
    return formData.username && formData.email && formData.contact && formData.password;
  };

  const farmersImage = "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80";

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1d3a 50%, #0f1729 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: '15%',
        right: '5%',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'float 8s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '8%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(70px)',
        animation: 'float 10s ease-in-out infinite reverse'
      }}></div>

      <div style={{
        width: '100%',
        maxWidth: '1100px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          animation: 'slideUp 0.6s ease-out'
        }}>
          <div style={{
            display: 'flex',
            minHeight: '700px',
            flexWrap: 'wrap'
          }}>
            {/* Left Side - Hero Section */}
            <div style={{
              flex: '1',
              minWidth: '450px',
              display: 'flex',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                flex: '1',
                backgroundImage: `url(${farmersImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                transform: 'scale(1.1)',
                transition: 'transform 0.3s ease'
              }}>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.95) 0%, rgba(80, 83, 117, 0.39) 50%, rgba(0, 0, 0, 0.38) 100%)',
                  backdropFilter: 'blur(2px)'
                }}></div>
              </div>

              {/* Decorative Elements */}
              <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                width: '60px',
                height: '60px',
                border: '2px solid rgba(168, 85, 247, 0.3)',
                borderRadius: '12px',
                transform: 'rotate(45deg)',
                animation: 'pulse 3s ease-in-out infinite'
              }}></div>

              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                padding: '60px 50px',
                zIndex: 1
              }}>
                <div style={{
                  color: 'white',
                  maxWidth: '450px'
                }}>
                  {/* Logo/Brand */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '32px',
                    padding: '12px 20px',
                    background: 'rgba(34, 197, 94, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    border: '1px solid rgba(34, 197, 94, 0.2)'
                  }}>
                    <div style={{
                      width: '10px',
                      height: '10px',
                      background: '#22c55e',
                      borderRadius: '50%',
                      boxShadow: '0 0 20px #22c55e',
                      animation: 'glow 2s ease-in-out infinite'
                    }}></div>
                    <span style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      letterSpacing: '0.5px'
                    }}>{t("brand_name")}</span>
                  </div>

                  <h1 style={{
                    fontSize: '48px',
                    fontWeight: '800',
                    lineHeight: '1.1',
                    margin: '0 0 24px 0',
                    background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'fadeInLeft 0.8s ease-out'
                  }}>
                    {t("smart_farming_journey")}
                  </h1>
                  <p style={{
                    fontSize: '18px',
                    margin: 0,
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: '1.6',
                    animation: 'fadeInLeft 0.8s ease-out 0.2s backwards'
                  }}>
                    {t("join_farmers_ai")}
                  </p>

                  {/* Features */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    marginTop: '40px',
                    animation: 'fadeInLeft 0.8s ease-out 0.4s backwards'
                  }}>
                    {[
                      { icon: '🌾', text: t("feature_crop_monitoring") },
                      { icon: '🌤️', text: t("feature_weather_alerts") },
                      { icon: '📊', text: t("feature_data_recommendations") }
                    ].map((feature, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}>
                        <span style={{ fontSize: '24px' }}>{feature.icon}</span>
                        <span style={{
                          fontSize: '15px',
                          color: 'rgba(255, 255, 255, 0.9)'
                        }}>{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form Section */}
            <div style={{
              flex: '1',
              minWidth: '450px',
              padding: '60px 50px',
              background: 'rgba(15, 23, 41, 0.6)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'relative',
              maxHeight: '700px',
              overflowY: 'auto'
            }}>
              {/* Decorative corner element */}
              <div style={{
                position: 'absolute',
                top: '30px',
                right: '30px',
                width: '80px',
                height: '80px',
                border: '2px solid rgba(168, 85, 247, 0.2)',
                borderRadius: '50%',
                animation: 'rotate 20s linear infinite'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '40px',
                  height: '40px',
                  border: '2px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '50%'
                }}></div>
              </div>

              <div style={{ animation: 'fadeIn 0.8s ease-out 0.3s backwards' }}>
                <h2 style={{
                  fontSize: '36px',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  margin: '0 0 12px 0',
                  letterSpacing: '-0.5px'
                }}>
                  {t("create_account")}
                </h2>
                <p style={{
                  fontSize: '15px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  margin: '0 0 32px 0',
                  fontWeight: '400'
                }}>
                  {t("fill_details")}
                </p>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px'
                }}>
                  {/* Username Field */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: 'rgba(255, 255, 255, 0.8)',
                      marginBottom: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      {t("username")}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <User style={{
                        position: 'absolute',
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '18px',
                        height: '18px',
                        color: focusedField === 'username' ? '#22c55e' : 'rgba(255, 255, 255, 0.4)',
                        transition: 'color 0.3s ease'
                      }} />
                      <input
                        type="text"
                        name="username"
                        placeholder={t("enter_username")}
                        value={formData.username}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('username')}
                        onBlur={() => setFocusedField(null)}
                        style={{
                          width: '100%',
                          padding: '14px 20px 14px 48px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: `2px solid ${focusedField === 'username' ? '#22c55e' : 'rgba(255, 255, 255, 0.1)'}`,
                          borderRadius: '12px',
                          fontSize: '15px',
                          color: '#ffffff',
                          transition: 'all 0.3s ease',
                          boxSizing: 'border-box',
                          outline: 'none'
                        }}
                      />
                      {focusedField === 'username' && (
                        <div style={{
                          position: 'absolute',
                          bottom: '-2px',
                          left: '0',
                          right: '0',
                          height: '2px',
                          background: 'linear-gradient(90deg, transparent, #22c55e, transparent)',
                          animation: 'shimmer 2s ease-in-out infinite'
                        }}></div>
                      )}
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: 'rgba(255, 255, 255, 0.8)',
                      marginBottom: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      {t("email_address")}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail style={{
                        position: 'absolute',
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '18px',
                        height: '18px',
                        color: focusedField === 'email' ? '#22c55e' : 'rgba(255, 255, 255, 0.4)',
                        transition: 'color 0.3s ease'
                      }} />
                      <input
                        type="email"
                        name="email"
                        placeholder={t("enter_email")}
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        style={{
                          width: '100%',
                          padding: '14px 20px 14px 48px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: `2px solid ${focusedField === 'email' ? '#22c55e' : 'rgba(255, 255, 255, 0.1)'}`,
                          borderRadius: '12px',
                          fontSize: '15px',
                          color: '#ffffff',
                          transition: 'all 0.3s ease',
                          boxSizing: 'border-box',
                          outline: 'none'
                        }}
                      />
                      {focusedField === 'email' && (
                        <div style={{
                          position: 'absolute',
                          bottom: '-2px',
                          left: '0',
                          right: '0',
                          height: '2px',
                          background: 'linear-gradient(90deg, transparent, #22c55e, transparent)',
                          animation: 'shimmer 2s ease-in-out infinite'
                        }}></div>
                      )}
                    </div>
                  </div>

                  {/* Contact Field */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: 'rgba(255, 255, 255, 0.8)',
                      marginBottom: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      {t("contact_number")}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Phone style={{
                        position: 'absolute ',
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '18px',
                        height: '18px',
                        color: focusedField === 'contact' ? '#22c55e' : 'rgba(255, 255, 255, 0.4)',
                        transition: 'color 0.3s ease'
                      }} />
                      <input
                        type="text"
                        name="contact"
                        placeholder={t("enter_contact")}
                        value={formData.contact}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('contact')}
                        onBlur={() => setFocusedField(null)}
                        style={{
                          width: '100%',
                          padding: '14px 20px 14px 48px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: `2px solid ${focusedField === 'contact' ? '#22c55e' : 'rgba(255, 255, 255, 0.1)'}`,
                          borderRadius: '12px',
                          fontSize: '15px',
                          color: '#ffffff',
                          transition: 'all 0.3s ease',
                          boxSizing: 'border-box',
                          outline: 'none'
                        }}
                      />
                      {focusedField === 'contact' && (
                        <div style={{
                          position: 'absolute',
                          bottom: '-2px',
                          left: '0',
                          right: '0',
                          height: '2px',
                          background: 'linear-gradient(90deg, transparent, #22c55e, transparent)',
                          animation: 'shimmer 2s ease-in-out infinite'
                        }}></div>
                      )}
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: 'rgba(255, 255, 255, 0.8)',
                      marginBottom: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      {t("password")}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Lock style={{
                        position: 'absolute',
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '18px',
                        height: '18px',
                        color: focusedField === 'password' ? '#22c55e' : 'rgba(255, 255, 255, 0.4)',
                        transition: 'color 0.3s ease'
                      }} />
                      <input
                        type="password"
                        name="password"
                        placeholder={t("create_password")}
                        value={formData.password}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && isFormValid()) {
                            handleSubmit();
                          }
                        }}
                        style={{
                          width: '100%',
                          padding: '14px 20px 14px 48px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: `2px solid ${focusedField === 'password' ? '#22c55e' : 'rgba(255, 255, 255, 0.1)'}`,
                          borderRadius: '12px',
                          fontSize: '15px',
                          color: '#ffffff',
                          transition: 'all 0.3s ease',
                          boxSizing: 'border-box',
                          outline: 'none'
                        }}
                      />
                      {focusedField === 'password' && (
                        <div style={{
                          position: 'absolute',
                          bottom: '-2px',
                          left: '0',
                          right: '0',
                          height: '2px',
                          background: 'linear-gradient(90deg, transparent, #22c55e, transparent)',
                          animation: 'shimmer 2s ease-in-out infinite'
                        }}></div>
                      )}
                    </div>
                  </div>

                  {error && (
                    <div style={{
                      padding: '14px 18px',
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '12px',
                      color: '#fca5a5',
                      fontSize: '14px',
                      fontWeight: '500',
                      animation: 'shake 0.5s ease-in-out'
                    }}>
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={!isFormValid() || isLoading}
                    style={{
                      width: '100%',
                      padding: '16px 28px',
                      background: !isFormValid() || isLoading 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                      color: !isFormValid() || isLoading ? 'rgba(255, 255, 255, 0.3)' : '#ffffff',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '700',
                      cursor: !isFormValid() || isLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      boxShadow: !isFormValid() || isLoading ? 'none' : '0 0 30px rgba(34, 197, 94, 0.4)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      if (isFormValid() && !isLoading) {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 0 40px rgba(34, 197, 94, 0.6)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = !isFormValid() || isLoading ? 'none' : '0 0 30px rgba(34, 197, 94, 0.4)';
                    }}
                  >
                    {!isFormValid() || isLoading ? null : (
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                        animation: 'slideRight 3s ease-in-out infinite'
                      }}></div>
                    )}
                    {isLoading ? (
                      <>
                        <div style={{
                          width: '18px',
                          height: '18px',
                          border: '3px solid rgba(255, 255, 255, 0.3)',
                          borderTop: '3px solid #ffffff',
                          borderRadius: '50%',
                          animation: 'spin 0.8s linear infinite'
                        }}></div>
                        {t("creating_account")}
                      </>
                    ) : (
                      <>
                        {t("sign_up")}
                        <span style={{ fontSize: '18px' }}>→</span>
                      </>
                    )}
                  </button>

                  <div style={{
                    textAlign: 'center',
                    marginTop: '8px'
                  }}>
                    <p style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.5)',
                      margin: 0
                    }}>
                      {t("already_have_account")}{' '}
                      <span
                        onClick={() => navigate("/login")}
                        style={{
                          color: '#22c55e',
                          fontWeight: '700',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.color = '#4ade80';
                          e.target.style.textShadow = '0 0 20px rgba(34, 197, 94, 0.5)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = '#22c55e';
                          e.target.style.textShadow = 'none';
                        }}
                      >
                        {t("login")}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: rotate(45deg) scale(1);
          }
          50% {
            opacity: 0.6;
            transform: rotate(45deg) scale(1.1);
          }
        }
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px #22c55e;
          }
          50% {
            box-shadow: 0 0 30px #22c55e, 0 0 40px #22c55e;
          }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes slideRight {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        input::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default Signup;