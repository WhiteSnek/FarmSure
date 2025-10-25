import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Carousel images - using placeholder images
  const slides = [
    {
      image:
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&q=80",
      title: "AI-Powered Crop Health",
      description: "Detect diseases early with advanced machine learning",
    },
    {
      image:
        "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&q=80",
      title: "Smart Fertilizer Recommendations",
      description: "Get personalized nutrient solutions for optimal growth",
    },
    {
      image:
        "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&q=80",
      title: "Data-Driven Farming",
      description: "Make informed decisions backed by technology",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const features = [
    {
      icon: "🔬",
      title: "Disease Detection",
      description:
        "Upload crop images to identify diseases instantly with high accuracy AI models",
      color: "#ef4444",
    },
    {
      icon: "🌱",
      title: "Fertilizer Recommendation",
      description:
        "Get customized fertilizer suggestions based on soil conditions and crop type",
      color: "#22c55e",
    },
    // {
    //   icon: "📊",
    //   title: "Crop Analytics",
    //   description:
    //     "Access detailed insights and analytics to optimize your farming practices",
    //   color: "#3b82f6",
    // },
    {
      icon: "🌾",
      title: "Yield Optimization",
      description:
        "Maximize your harvest with data-driven recommendations and best practices",
      color: "#f59e0b",
    },
  ];

  return (
    <div
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        backgroundColor: "#f8fafc",
      }}
    >
      {/* Hero Carousel Section */}
      <div
        style={{
          position: "relative",
          height: "600px",
          overflow: "hidden",
          backgroundColor: "#000",
        }}
      >
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              opacity: currentSlide === index ? 1 : 0,
              transition: "opacity 1s ease-in-out",
              backgroundImage: `url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 100%)",
              }}
            ></div>

            {/* Content */}
            <div
              style={{
                position: "relative",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                color: "white",
                padding: "0 20px",
                zIndex: 1,
              }}
            >
              <h1
                style={{
                  fontSize: "56px",
                  fontWeight: "700",
                  margin: "0 0 20px 0",
                  maxWidth: "800px",
                  lineHeight: "1.2",
                  textShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
                  animation:
                    currentSlide === index ? "fadeInUp 0.8s ease-out" : "none",
                }}
              >
                {slide.title}
              </h1>
              <p
                style={{
                  fontSize: "24px",
                  margin: "0 0 40px 0",
                  maxWidth: "600px",
                  opacity: 0.95,
                  textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
                  animation:
                    currentSlide === index
                      ? "fadeInUp 0.8s ease-out 0.2s backwards"
                      : "none",
                }}
              >
                {slide.description}
              </p>
              <Link to={"/crop"}>
                <button
                  style={{
                    padding: "16px 40px",
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "white",
                    backgroundColor: "#22c55e",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 12px rgba(34, 197, 94, 0.4)",
                    animation:
                      currentSlide === index
                        ? "fadeInUp 0.8s ease-out 0.4s backwards"
                        : "none",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#16a34a";
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow =
                      "0 6px 16px rgba(34, 197, 94, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#22c55e";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow =
                      "0 4px 12px rgba(34, 197, 94, 0.4)";
                  }}
                >
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          style={{
            position: "absolute",
            left: "20px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "50px",
            height: "50px",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            border: "2px solid rgba(255, 255, 255, 0.5)",
            borderRadius: "50%",
            color: "white",
            fontSize: "24px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(4px)",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
            e.target.style.transform = "translateY(-50%) scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
            e.target.style.transform = "translateY(-50%) scale(1)";
          }}
        >
          ‹
        </button>

        <button
          onClick={nextSlide}
          style={{
            position: "absolute",
            right: "20px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "50px",
            height: "50px",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            border: "2px solid rgba(255, 255, 255, 0.5)",
            borderRadius: "50%",
            color: "white",
            fontSize: "24px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(4px)",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
            e.target.style.transform = "translateY(-50%) scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
            e.target.style.transform = "translateY(-50%) scale(1)";
          }}
        >
          ›
        </button>

        {/* Dots Indicator */}
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "12px",
            zIndex: 10,
          }}
        >
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{
                width: currentSlide === index ? "40px" : "12px",
                height: "12px",
                borderRadius: "6px",
                border: "none",
                backgroundColor:
                  currentSlide === index
                    ? "#22c55e"
                    : "rgba(255, 255, 255, 0.5)",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>
      {/* Introduction Section */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "80px 20px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "42px",
            fontWeight: "700",
            color: "#1f2937",
            margin: "0 0 20px 0",
          }}
        >
          Welcome to <span style={{ color: "#22c55e" }}>FarmSure</span>
        </h2>
        <p
          style={{
            fontSize: "20px",
            color: "#6b7280",
            maxWidth: "800px",
            margin: "0 auto 60px auto",
            lineHeight: "1.6",
          }}
        >
          Empowering farmers with cutting-edge AI technology to detect crop
          diseases, recommend optimal fertilizers, and maximize agricultural
          productivity.
        </p>

        {/* Features Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "30px",
            marginTop: "60px",
          }}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "white",
                padding: "40px 30px",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                transition: "all 0.3s ease",
                border: "1px solid #e5e7eb",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 40px rgba(0, 0, 0, 0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(0, 0, 0, 0.08)";
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  margin: "0 auto 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "40px",
                  backgroundColor: `${feature.color}15`,
                  borderRadius: "50%",
                }}
              >
                {feature.icon}
              </div>
              <h3
                style={{
                  fontSize: "22px",
                  fontWeight: "600",
                  color: "#1f2937",
                  margin: "0 0 12px 0",
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  fontSize: "16px",
                  color: "#6b7280",
                  margin: 0,
                  lineHeight: "1.6",
                }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* How It Works Section */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "80px 20px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "42px",
            fontWeight: "700",
            color: "#1f2937",
            margin: "0 0 40px 0",
          }}
        >
          How <span style={{ color: "#22c55e" }}>FarmSure</span> Works
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "40px",
            marginTop: "40px",
          }}
        >
          {[
            {
              icon: "📸",
              title: "Upload Crop Images",
              description:
                "Take photos of your crops to let AI analyze health and detect diseases.",
            },
            {
              icon: "🧪",
              title: "Get Recommendations",
              description:
                "Receive precise fertilizer and nutrient suggestions based on soil and crop type.",
            },
            {
              icon: "📊",
              title: "Monitor Progress",
              description:
                "Track your crop health and growth trends with real-time analytics.",
            },
          ].map((step, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "white",
                padding: "40px 30px",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                transition: "all 0.3s ease",
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  margin: "0 auto 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "40px",
                  backgroundColor: "#22c55e15",
                  borderRadius: "50%",
                }}
              >
                {step.icon}
              </div>
              <h3
                style={{
                  fontSize: "22px",
                  fontWeight: "600",
                  color: "#1f2937",
                  margin: "0 0 12px 0",
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontSize: "16px",
                  color: "#6b7280",
                  margin: 0,
                  lineHeight: "1.6",
                }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Platform Benefits Section */}
      <div
        style={{
          backgroundColor: "#f0fdf4",
          padding: "80px 20px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "42px",
            fontWeight: "700",
            color: "#1f2937",
            margin: "0 0 40px 0",
          }}
        >
          Why Choose <span style={{ color: "#22c55e" }}>FarmSure</span>
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "40px",
            marginTop: "40px",
          }}
        >
          {[
            {
              icon: "⚡",
              title: "Fast & Accurate",
              description:
                "AI models deliver quick and precise disease detection for timely interventions.",
            },
            {
              icon: "💹",
              title: "Data-Driven",
              description:
                "Optimize yields and reduce losses with actionable insights based on real data.",
            },
            {
              icon: "🌱",
              title: "Sustainable Farming",
              description:
                "Recommendations focus on balanced fertilizer usage and eco-friendly practices.",
            },
            {
              icon: "🤝",
              title: "Farmer-Centric",
              description:
                "Designed to empower farmers with easy-to-use tools for better decision making.",
            },
          ].map((benefit, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "white",
                padding: "40px 30px",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                transition: "all 0.3s ease",
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  margin: "0 auto 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "40px",
                  backgroundColor: "#22c55e15",
                  borderRadius: "50%",
                }}
              >
                {benefit.icon}
              </div>
              <h3
                style={{
                  fontSize: "22px",
                  fontWeight: "600",
                  color: "#1f2937",
                  margin: "0 0 12px 0",
                }}
              >
                {benefit.title}
              </h3>
              <p
                style={{
                  fontSize: "16px",
                  color: "#6b7280",
                  margin: 0,
                  lineHeight: "1.6",
                }}
              >
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
