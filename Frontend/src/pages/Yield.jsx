import React, { useState } from "react";

const Yield = () => {
  const yieldImage="https://plus.unsplash.com/premium_photo-1664197864438-bc9251cce42e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDR8fGhhcmQlMjB3b3JrfGVufDB8fDB8fHww";
  const [formData, setFormData] = useState({
  Crop: "",
  Season: "Kharif",
  State: "",
  Area: "",
  Fertilizer: "",
  Pesticide: ""
});

  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const seasons = [
    "Kharif", "Rabi", "Whole Year", "Summer", "Winter", "Autumn"
  ];

  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
    "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
    "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
    "West Bengal"
  ];

  const crops = [
    "Rice", "Wheat", "Maize", "Cotton", "Sugarcane", "Soyabean", "Groundnut",
    "Sunflower", "Jowar", "Bajra", "Ragi", "Moong", "Urad", "Arhar/Tur",
    "Masoor", "Gram", "Rapeseed & Mustard", "Safflower", "Sesamum",
    "Nigerseed", "Castorseed", "Linseed", "Coconut", "Dry Chillies",
    "Turmeric", "Coriander", "Garlic", "Ginger", "Onion", "Potato",
    "Sweet Potato", "Tapioca", "Banana", "Papaya", "Mango", "Orange",
    "Apple", "Grapes", "Pomegranate", "Arecanut", "Cashewnut", "Tea",
    "Coffee", "Rubber", "Tobacco", "Jute", "Mesta"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log(formData)
    setPrediction(null);

    try {
      const res = await fetch(`${process.env.YIELD_MODEL_URI}/predict_yield`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        Crop: formData.Crop,
        Season: formData.Season,
        State: formData.State,
        Area: Number(formData.Area) / 11959.9,// Convert gajj to hectares 
        Fertilizer: Number(formData.Fertilizer),
        Pesticide: Number(formData.Pesticide)
      })

     

      });
      //console.log(res);

      const result = await res.json();
      setPrediction(result.predicted_yield);
    } catch (err) {
      console.error("Prediction error:", err);
      setPrediction("Error getting prediction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

    const isFormValid = () => {
      return (
        formData.Crop &&
        formData.Season &&
        formData.State &&
        formData.Area &&
        formData.Fertilizer &&
        formData.Pesticide
      );
    };


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
        maxWidth: '1200px',
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
            minHeight: '680px',
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
                backgroundImage: `url(${yieldImage})`,
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
                top: '20px',
                left: '20px',
                width: '60px',
                height: '60px',
                border: '2px solid rgba(34, 197, 94, 0.3)',
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
                    }}>FarmSure</span>
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
                    AI Yield Forecaster
                  </h1>
                  <p style={{
                    fontSize: '18px',
                    margin: 0,
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: '1.6',
                    animation: 'fadeInLeft 0.8s ease-out 0.2s backwards'
                  }}>
                    Predict <span style={{ 
                      color: '#22c55e', 
                      fontWeight: '600',
                      textShadow: '0 0 20px rgba(34, 197, 94, 0.5)'
                    }}>harvest outcomes</span> with 99.5% accuracy using location, season, and crop data
                  </p>

                  {/* Stats */}
                  <div style={{
                    display: 'flex',
                    gap: '24px',
                    marginTop: '40px',
                    animation: 'fadeInLeft 0.8s ease-out 0.4s backwards'
                  }}>
                    {[
                      { label: 'States Covered', value: '28' },
                      { label: 'Crops Supported', value: '40+' },
                      { label: 'Accuracy', value: '99.5%' }
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

            {/* Right Side - Form Section */}
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
                  Yield Prediction Engine
                </h2>
                <p style={{
                  fontSize: '15px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  margin: '0 0 40px 0',
                  fontWeight: '400'
                }}>
                  Enter crop details for hyper-accurate yield forecasts
                </p>

                <form
                  onSubmit={handleSubmit}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                  }}
                >
                  {/* State and Season */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '20px'
                    }}
                  >
                    {/* State */}
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '13px',
                          fontWeight: '600',
                          color: 'rgba(255, 255, 255, 0.8)',
                          marginBottom: '10px',
                          textTransform: 'uppercase',
                          letterSpacing: '1px'
                        }}
                      >
                        State
                      </label>
                      <select
                        name="State"
                        value={formData.State}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('State')}
                        onBlur={() => setFocusedField(null)}
                        required
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: `2px solid ${focusedField === 'State' ? '#22c55e' : 'rgba(255, 255, 255, 0.1)'}`,
                          borderRadius: '12px',
                          fontSize: '15px',
                          color: 'rgb(255, 255, 255)',
                          transition: 'all 0.3s ease',
                          outline: 'none',
                          appearance: 'none',
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='rgba(255,255,255,0.5)' height='24' viewBox='0 0 24 24' width='24'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 16px center',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="">Select State</option>
                        {states.map(state => (
                          <option key={state} value={state} style={{ color: 'rgb(255, 255, 255)' }}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Season */}
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '13px',
                          fontWeight: '600',
                          color: 'rgba(255, 255, 255, 0.8)',
                          marginBottom: '10px',
                          textTransform: 'uppercase',
                          letterSpacing: '1px'
                        }}
                      >
                        Season
                      </label>
                      <select
                        name="Season"
                        value={formData.Season}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('Season')}
                        onBlur={() => setFocusedField(null)}
                        required
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: `2px solid ${focusedField === 'Season' ? '#22c55e' : 'rgba(255, 255, 255, 0.1)'}`,
                          borderRadius: '12px',
                          fontSize: '15px',
                          color: '#ffffff',
                          transition: 'all 0.3s ease',
                          outline: 'none',
                          appearance: 'none',
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='rgba(255,255,255,0.5)' height='24' viewBox='0 0 24 24' width='24'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 16px center',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="">Select Season</option>
                        {seasons.map(season => (
                          <option key={season} value={season} style={{ color: 'rgb(255, 255, 255)' }}>
                            {season}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Crop and Area */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '20px'
                    }}
                  >
                    {/* Crop */}
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '13px',
                          fontWeight: '600',
                          color: 'rgba(255, 255, 255, 0.8)',
                          marginBottom: '10px',
                          textTransform: 'uppercase',
                          letterSpacing: '1px'
                        }}
                      >
                        Crop
                      </label>
                      <select
                        name="Crop"
                        value={formData.Crop}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('Crop')}
                        onBlur={() => setFocusedField(null)}
                        required
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: `2px solid ${focusedField === 'Crop' ? '#22c55e' : 'rgba(255, 255, 255, 0.1)'}`,
                          borderRadius: '12px',
                          fontSize: '15px',
                          color: '#ffffff',
                          transition: 'all 0.3s ease',
                          outline: 'none',
                          appearance: 'none',
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='rgba(255,255,255,0.5)' height='24' viewBox='0 0 24 24' width='24'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 16px center',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="">Select Crop</option>
                        {crops.map(crop => (
                          <option key={crop} value={crop} style={{ color: 'rgb(255, 255, 255)' }}>
                            {crop}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Area */}
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '13px',
                          fontWeight: '600',
                          color: 'rgba(255, 255, 255, 0.8)',
                          marginBottom: '10px',
                          textTransform: 'uppercase',
                          letterSpacing: '1px'
                        }}
                      >
                        Area (gajj)
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="number"
                          name="Area"
                          value={formData.Area}
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField('Area')}
                          onBlur={() => setFocusedField(null)}
                          required
                          min="0.01"
                          step="0.01"
                          placeholder="e.g. 10.5"
                          style={{
                            width: '100%',
                            padding: '16px 20px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: `2px solid ${focusedField === 'Area' ? '#22c55e' : 'rgba(255, 255, 255, 0.1)'}`,
                            borderRadius: '12px',
                            fontSize: '15px',
                            color: 'rgb(255, 255, 255)',
                            transition: 'all 0.3s ease',
                            outline: 'none'
                          }}
                        />
                        {focusedField === 'Area' && (
                          <div
                            style={{
                              position: 'absolute',
                              bottom: '-2px',
                              left: '0',
                              right: '0',
                              height: '2px',
                              background: 'linear-gradient(90deg, transparent, #22c55e, transparent)',
                              animation: 'shimmer 2s ease-in-out infinite'
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Fertilizer and Pesticide */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '20px'
                    }}
                  >
                    {/* Fertilizer */}
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '13px',
                          fontWeight: '600',
                          color: 'rgba(255, 255, 255, 0.8)',
                          marginBottom: '10px',
                          textTransform: 'uppercase',
                          letterSpacing: '1px'
                        }}
                      >
                        Fertilizer (kg)
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="number"
                          name="Fertilizer"
                          value={formData.Fertilizer}
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField('Fertilizer')}
                          onBlur={() => setFocusedField(null)}
                          required
                          min="0"
                          step="0.01"
                          placeholder="e.g. 150.5"
                          style={{
                            width: '100%',
                            padding: '16px 20px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: `2px solid ${focusedField === 'Fertilizer' ? '#22c55e' : 'rgba(255, 255, 255, 0.1)'}`,
                            borderRadius: '12px',
                            fontSize: '15px',
                            color: 'rgb(255, 255, 255)',
                            transition: 'all 0.3s ease',
                            outline: 'none'
                          }}
                        />
                        {focusedField === 'Fertilizer' && (
                          <div
                            style={{
                              position: 'absolute',
                              bottom: '-2px',
                              left: '0',
                              right: '0',
                              height: '2px',
                              background: 'linear-gradient(90deg, transparent, #22c55e, transparent)',
                              animation: 'shimmer 2s ease-in-out infinite'
                            }}
                          />
                        )}
                      </div>
                    </div>

                    {/* Pesticide */}
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '13px',
                          fontWeight: '600',
                          color: 'rgba(255, 255, 255, 0.8)',
                          marginBottom: '10px',
                          textTransform: 'uppercase',
                          letterSpacing: '1px'
                        }}
                      >
                        Pesticide (kg)
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="number"
                          name="Pesticide"
                          value={formData.Pesticide}
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField('Pesticide')}
                          onBlur={() => setFocusedField(null)}
                          required
                          min="0"
                          step="0.01"
                          placeholder="e.g. 25.0"
                          style={{
                            width: '100%',
                            padding: '16px 20px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: `2px solid ${focusedField === 'Pesticide' ? '#22c55e' : 'rgba(255, 255, 255, 0.1)'}`,
                            borderRadius: '12px',
                            fontSize: '15px',
                            color: 'rgb(255, 255, 255)',
                            transition: 'all 0.3s ease',
                            outline: 'none'
                          }}
                        />
                        {focusedField === 'Pesticide' && (
                          <div
                            style={{
                              position: 'absolute',
                              bottom: '-2px',
                              left: '0',
                              right: '0',
                              height: '2px',
                              background: 'linear-gradient(90deg, transparent, #22c55e, transparent)',
                              animation: 'shimmer 2s ease-in-out infinite'
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!isFormValid() || isLoading}
                    style={{
                      marginTop: '12px',
                      padding: '16px 32px',
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
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                          animation: 'slideRight 3s ease-in-out infinite'
                        }}
                      />
                    )}
                    {isLoading ? (
                      <>
                        <div
                          style={{
                            width: '18px',
                            height: '18px',
                            border: '3px solid rgba(255, 255, 255, 0.3)',
                            borderTop: '3px solid #ffffff',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite'
                          }}
                        />
                        Predicting...
                      </>
                    ) : (
                      <>
                        Predict Yield
                        <span style={{ fontSize: '18px' }}>→</span>
                      </>
                    )}
                  </button>

                  {/* Pro Tip */}
                  <div
                    style={{
                      marginTop: '32px',
                      padding: '20px',
                      background: 'rgba(34, 197, 94, 0.1)',
                      border: '1px solid rgba(34, 197, 94, 0.2)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.8)',
                        lineHeight: '1.6'
                      }}
                    >
                      <strong style={{ color: '#22c55e' }}>Pro Tip:</strong> Enter accurate fertilizer and pesticide usage for best yield predictions.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Prediction Result - Outside Card */}
        {prediction && (
          <div style={{
            marginTop: '40px',
            animation: 'fadeInUp 0.8s ease-out'
          }}>
            <div style={{ 
              textAlign: "center", 
              marginBottom: "40px",
              padding: '0 20px'
            }}>
              <h2 style={{
                fontSize: '42px',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: '0 0 12px 0',
                letterSpacing: '-1px'
              }}>
                Yield Forecast Complete
              </h2>
              <p style={{ 
                fontSize: '18px', 
                color: 'rgba(255, 255, 255, 0.7)', 
                margin: 0,
                fontWeight: '500'
              }}>
                {formData.Crop} in {formData.State_Name}, {formData.Crop_Year}
              </p>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              padding: '50px 40px',
              margin: '0 20px',
              textAlign: 'center',
              animation: 'fadeInUp 0.6s ease-out'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 28px',
                background: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '12px',
                marginBottom: '24px',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  background: '#22c55e',
                  borderRadius: '50%',
                  boxShadow: '0 0 20px #22c55e',
                  animation: 'glow 2s ease-in-out infinite'
                }}></div>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#22c55e',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  AI-Powered Prediction
                </span>
              </div>
              
              <h3 style={{
                fontSize: '64px',
                fontWeight: '900',
                margin: '0 0 16px 0',
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: '1'
              }}>
                {typeof prediction === 'number' ? prediction.toFixed(2) : prediction}
              </h3>
              
              {typeof prediction === 'number' && (
                <p style={{
                  fontSize: '20px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  margin: '0 0 24px 0',
                  fontWeight: '500'
                }}>
                  <span style={{ color: '#22c55e' }}>tonnes</span> per hectare
                </p>
              )}
              
              <p style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.6)',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                {typeof prediction === 'number' 
                  ? `Expected total yield: ${(prediction * parseFloat(formData.Area)).toFixed(2)} tonnes across ${formData.Area} hectares`
                  : 'Please try again with valid parameters'}
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '16px',
              marginTop: '40px',
              padding: '0 20px'
            }}>
              <button style={{
                padding: '14px 32px',
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 0 30px rgba(34, 197, 94, 0.4)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
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
                Export Forecast
              </button>
              <button style={{
                padding: '14px 32px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                fontSize: '16px',
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
                New Prediction
              </button>
            </div>
          </div>
        )}
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
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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
        input::placeholder, select {
          color: rgba(210, 98, 98, 0.3) !important;
        }
        select option {
          background: #1a1d3a;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default Yield;