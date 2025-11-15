import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();

  const [currentSlide, setCurrentSlide] = useState(0);

  // Carousel images
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&q=80",
      title: t("slide_crop_health_title"),
      description: t("slide_crop_health_desc"),
    },
    {
      image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&q=80",
      title: t("slide_fertilizer_title"),
      description: t("slide_fertilizer_desc"),
    },
    {
      image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&q=80",
      title: t("slide_data_driven_title"),
      description: t("slide_data_driven_desc"),
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const features = [
    {
      icon: "Microscope",
      title: t("feature_disease_detection"),
      description: t("feature_disease_desc"),
      color: "#ef4444",
    },
    {
      icon: "Seedling",
      title: t("feature_fertilizer_recommendation"),
      description: t("feature_fertilizer_desc"),
      color: "#22c55e",
    },
    {
      icon: "Wheat",
      title: t("feature_yield_optimization"),
      description: t("feature_yield_desc"),
      color: "#f59e0b",
    },
  ];

  const farmersImage = "https://images.unsplash.com/photo-1505471768190-275e2ad7b3f9?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=800&q=80";

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
        top: '10%',
        left: '5%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'float 8s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '8%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
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
            minHeight: '650px',
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
                  background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.95) 0%, rgba(26, 29, 58, 0.85) 50%, rgba(15, 23, 41, 0.9) 100%)',
                  backdropFilter: 'blur(2px)'
                }}></div>
              </div>

              {/* Decorative Elements */}
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                width: '60px',
                height: '60px',
                border: '2px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '12px',
                transform: ' 45deg',
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
                    {t("welcome_future_farming")}
                  </h1>
                  <p style={{
                    fontSize: '18px',
                    margin: 0,
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: '1.6',
                    animation: 'fadeInLeft 0.8s ease-out 0.2s backwards'
                  }}>
                    {t("access_ai_farming_home")}
                  </p>

                  {/* Stats */}
                  <div style={{
                    display: 'flex',
                    gap: '24px',
                    marginTop: '40px',
                    animation: 'fadeInLeft 0.8s ease-out 0.4s backwards'
                  }}>
                    {[
                      { label: t("active_users"), value: '50K+' },
                      { label: t("farms_connected"), value: '30K+' }
                    ].map((stat, i) => (
                      <div key={i} style={{
                        padding: '16px 20px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}>
                        <div style={{
                          fontSize: '24px',
                          fontWeight: '700',
                          color: '#22c55e',
                          marginBottom: '4px'
                        }}>{stat.value}</div>
                        <div style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Home Content Section */}
            <div style={{
              flex: '1',
              minWidth: '450px',
              padding: '70px 50px',
              background: 'rgba(15, 23, 41, 0.6)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'relative'
            }}>
              {/* Decorative corner element */}
              <div style={{
                position: 'absolute',
                top: '30px',
                right: '30px',
                width: '80px',
                height: '80px',
                border: '2px solid rgba(59, 130, 246, 0.2)',
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
                  {t("welcome_farmassist")}
                </h2>
                <p style={{
                  fontSize: '15px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  margin: '0 0 40px 0',
                  fontWeight: '400'
                }}>
                  {t("empowering_farmers")}
                </p>

                {/* Carousel Section */}
                <div style={{
                  position: 'relative',
                  height: '300px',
                  overflow: 'hidden',
                  borderRadius: '16px',
                  marginBottom: '40px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  {slides.map((slide, index) => (
                    <div
                      key={index}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: currentSlide === index ? 1 : 0,
                        transition: 'opacity 1s ease-in-out',
                        backgroundImage: `url(${slide.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        padding: '30px',
                        color: 'white'
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.7) 0%, rgba(15, 23, 41, 0.5) 100%)'
                      }}></div>
                      <div style={{ position: 'relative', zIndex: 1 }}>
                        <h3 style={{
                          fontSize: '24px',
                          fontWeight: '700',
                          margin: '0 0 8px 0'
                        }}>{slide.title}</h3>
                        <p style={{
                          fontSize: '14px',
                          margin: 0,
                          opacity: 0.9
                        }}>{slide.description}</p>
                      </div>
                    </div>
                  ))}

                  {/* Navigation Dots */}
                  <div style={{
                    position: 'absolute',
                    bottom: '15px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '8px'
                  }}>
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        style={{
                          width: currentSlide === index ? '24px' : '8px',
                          height: '8px',
                          borderRadius: '4px',
                          border: 'none',
                          backgroundColor: currentSlide === index ? '#22c55e' :'rgba(255, 255, 255, 0.4)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Features Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: '16px',
                  marginBottom: '40px'
                }}>
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateX(4px)';
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateX(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{
                        width: '50px',
                        height: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        background: `${feature.color}20`,
                        borderRadius: '50%',
                        flexShrink: 0
                      }}>
                        {feature.icon}
                      </div>
                      <div>
                        <h4 style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#ffffff',
                          margin: '0 0 4px 0'
                        }}>{feature.title}</h4>
                        <p style={{
                          fontSize: '13px',
                          color: 'rgba(255, 255, 255, 0.7)',
                          margin: 0,
                          lineHeight: '1.5'
                        }}>{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  justifyContent: 'center'
                }}>
                  <Link to="/crop">
                    <button
                      style={{
                        padding: '14px 32px',
                        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '15px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 0 30px rgba(34, 197, 94, 0.4)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 0 40px rgba(34, 197, 94, 0.6)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 0 30px rgba(34, 197, 94, 0.4)';
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                        animation: 'slideRight 3s ease-in-out infinite'
                      }}></div>
                      {t("get_started")}
                    </button>
                  </Link>

                  <Link to="/login">
                    <button
                      style={{
                        padding: '14px 32px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        fontSize: '15px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        backdropFilter: 'blur(10px)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                        e.target.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      {t("sign_in")}
                    </button>
                  </Link>
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

export default Home;