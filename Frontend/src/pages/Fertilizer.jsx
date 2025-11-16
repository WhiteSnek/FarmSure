import React, { useState } from "react";
import FertilizerPrediction from "../components/FertilizerPrediction";
import { useTranslation } from "react-i18next";

const Fertilizer = () => {
  const { t } = useTranslation();
  const fertilizerImage = "https://plus.unsplash.com/premium_photo-1680125265832-ffaf364a8aca?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZmVydGlsaXplcnN8ZW58MHx8MHx8fDA%3D";
  
  const [formData, setFormData] = useState({
    location: "",
    humid: "",
    mois: "",
    soil: "0",
    crop: "0",
    nitro: "",
    pota: "",
    phos: ""
  });
  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
    "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
    "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
    "West Bengal"
  ];
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const soilTypes = [
    { value: "0", label: "Black" },
    { value: "1", label: "Clayey" },
    { value: "2", label: "Loamy" },
    { value: "3", label: "Red" },
    { value: "4", label: "Sandy" }
  ];
  const handleLocationChange = (e) => {
  setFormData(prev => ({
    ...prev,
    location: e.target.value
  }));
};


  const cropTypes = [
    { value: "0", label: "Barley" },
    { value: "1", label: "Cotton" },
    { value: "2", label: "Ground Nuts" },
    { value: "3", label: "Maize" },
    { value: "4", label: "Millets" },
    { value: "5", label: "Oil Seeds" },
    { value: "6", label: "Paddy" },
    { value: "7", label: "Pulses" },
    { value: "8", label: "Sugarcane" },
    { value: "9", label: "Tobacco" },
    { value: "10", label: "Wheat" },
    { value: "11", label: "Coffee" },
    { value: "12", label: "Kidney Beans" },
    { value: "13", label: "Orange" },
    { value: "14", label: "Pomegranate" },
    { value: "15", label: "Rice" },
    { value: "16", label: "Watermelon" }
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
    setPrediction(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_FERTILIZER_MODEL_URI}`,  {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: parseFloat(formData.location),
          mois: parseFloat(formData.mois),
          soil: parseInt(formData.soil),
          crop: parseInt(formData.crop),
          nitro: parseFloat(formData.nitro),
          pota: parseFloat(formData.pota),
          phos: parseFloat(formData.phos)
        })
      });

      const result = await res.json();
      console.log(result)
      setPrediction(result.fertilizer || result.recommendation);
    } catch (err) {
      console.error("Prediction error:", err);
      setPrediction(t("prediction_error"));
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return formData.location  && formData.mois && formData.soil &&
           formData.nitro && formData.pota && formData.phos;
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
                backgroundImage: `url(${fertilizerImage})`,
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
                    {t("precision_nutrient_intelligence")}
                  </h1>
                  <p style={{
                    fontSize: '18px',
                    margin: 0,
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: '1.6',
                    animation: 'fadeInLeft 0.8s ease-out 0.2s backwards'
                  }}>
                    {t("get_ai_powered_recommendations")}
                  </p>

                  {/* Stats */}
                  <div style={{
                    display: 'flex',
                    gap: '24px',
                    marginTop: '40px',
                    animation: 'fadeInLeft 0.8s ease-out 0.4s backwards'
                  }}>
                    {[
                      { label: t("crops_supported"), value: '17+' },
                      { label: t("soil_types"), value: '5' },
                      { label: t("accuracy"), value: '99.2%' }
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
                  {t("smart_fertilizer_advisor")}
                </h2>
                <p style={{
                  fontSize: '15px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  margin: '0 0 40px 0',
                  fontWeight: '400'
                }}>
                  {t("enter_soil_climate_data")}
                </p>

                <form onSubmit={handleSubmit} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px'
                }}>
                  {/* Environmental Conditions */}
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
                       {t("location_city")}
                    </label>
                    <select
                      name="location"
                      value={formData.location || ""}
                      onChange={handleLocationChange}
                      onFocus={() => setFocusedField('location')}
                      onBlur={() => setFocusedField(null)}
                      required
                      style={{
                        width: '100%',
                        padding: '16px 20px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: `2px solid ${focusedField === 'location' ? '#22c55e' : 'rgba(255, 255, 255, 0.1)'}`,
                        borderRadius: '12px',
                        fontSize: '15px',
                        color: 'rgb(255, 255, 255)',
                        transition: 'all 0.3s ease',
                        outline: 'none',
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='rgba(0, 0, 0, 0.9)' height='24' viewBox='0 0 24 24' width='24'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 16px center',
                        cursor: 'pointer',
                        backgroundColor: '#0f172a',
                      }}
                    >
                      <option value="">Select City</option>
                      {states.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

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
                      {t("soil_moisture_percent")}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="number"
                        name="mois"
                        value={formData.mois}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('mois')}
                        onBlur={() => setFocusedField(null)}
                        required
                        step="0.1"
                        placeholder={t("mois_placeholder")}
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: `2px solid ${focusedField === 'mois' ? '#22c55e' : 'rgba(255, 255, 255, 0.1)'}`,
                          borderRadius: '12px',
                          fontSize: '15px',
                          color: '#ffffff',
                          transition: 'all 0.3s ease',
                          boxSizing: 'border-box',
                          outline: 'none'
                        }}
                      />
                      {focusedField === 'mois' && (
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

                  {/* Soil and Crop Type */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '20px'
                  }}>
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
                        {t("soil_type")}
                      </label>
                      <select
                        name="soil"
                        value={formData.soil}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '2px solid rgba(255, 255, 255, 0.1)',
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
                        onFocus={(e) => e.target.style.borderColor = '#22c55e'}
                        onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                      >
                        {soilTypes.map(soil => (
                          <option key={soil.value} value={soil.value} style={{ color: 'rgba(255, 255, 255, 0.8)'}}>
                            {soil.label}
                          </option>
                        ))}
                      </select>
                    </div>

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
                        {t("crop_type")}
                      </label>
                      <select
                        name="crop"
                        value={formData.crop}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '2px solid rgba(255, 255, 255, 0.1)',
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
                        onFocus={(e) => e.target.style.borderColor = '#22c55e'}
                        onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                      >
                        {cropTypes.map(crop => (
                          <option key={crop.value} value={crop.value} style={{ color: 'rgba(255, 255, 255, 0.8)'}}>
                            {crop.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* NPK Values */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '20px'
                  }}>
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
                        {t("nitrogen_n")}
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="number"
                          name="nitro"
                          value={formData.nitro}
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField('nitro')}
                          onBlur={() => setFocusedField(null)}
                          required
                          step="0.1"
                          placeholder={t("nitro_placeholder")}
                          style={{
                            width: '100%',
                            padding: '16px 20px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: `2px solid ${focusedField === 'nitro' ? '#22c55e' : 'rgba(255, 255, 255, 0.1)'}`,
                            borderRadius: '12px',
                            fontSize: '15px',
                            color: '#ffffff',
                            transition: 'all 0.3s ease',
                            boxSizing: 'border-box',
                            outline: 'none'
                          }}
                        />
                        {focusedField === 'nitro' && (
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
                        {t("potassium_k")}
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="number"
                          name="pota"
                          value={formData.pota}
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField('pota')}
                          onBlur={() => setFocusedField(null)}
                          required
                          step="0.1"
                          placeholder={t("pota_placeholder")}
                          style={{
                            width: '100%',
                            padding: '16px 20px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: `2px solid ${focusedField === 'pota' ? '#22c55e' : 'rgba(255, 255, 255, 0.1)'}`,
                            borderRadius: '12px',
                            fontSize: '15px',
                            color: '#ffffff',
                            transition: 'all 0.3s ease',
                            boxSizing: 'border-box',
                            outline: 'none'
                          }}
                        />
                        {focusedField === 'pota' && (
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
                        {t("phosphorus_p")}
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="number"
                          name="phos"
                          value={formData.phos}
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField('phos')}
                          onBlur={() => setFocusedField(null)}
                          required
                          step="0.1"
                          placeholder={t("phos_placeholder")}
                          style={{
                            width: '100%',
                            padding: '16px 20px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: `2px solid ${focusedField === 'phos' ? '#22c55e' : 'rgba(255, 255, 255, 0.1)'}`,
                            borderRadius: '12px',
                            fontSize: '15px',
                            color: '#ffffff',
                            transition: 'all 0.3s ease',
                            boxSizing: 'border-box',
                            outline: 'none'
                          }}
                        />
                        {focusedField === 'phos' && (
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
                  </div>

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
                        {t("analyzing")}
                      </>
                    ) : (
                      <>
                        {t("get_recommendation")}
                        <span style={{ fontSize: '18px' }}>→</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Pro Tip */}
                <div style={{
                  marginTop: '32px',
                  padding: '20px',
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)'
                }}>
                  <p style={{
                    margin: 0,
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: '1.6'
                  }}>
                    <strong style={{ color: '#22c55e' }}>{t("pro_tip")}:</strong> {t("use_recent_soil_test")}
                  </p>
                </div>
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
                {t("ai_recommendation_ready")}
              </h2>
              <p style={{ 
                fontSize: '18px', 
                color: 'rgba(255, 255, 255, 0.7)', 
                margin: 0,
                fontWeight: '500'
              }}>
                {t("optimal_fertilizer_blend")}
              </p>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              padding: '40px',
              margin: '0 20px',
              animation: 'fadeInUp 0.6s ease-out'
            }}>
              <FertilizerPrediction fertilizer={prediction} />
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
                {t("save_report")}
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
                {t("new_analysis")}
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 0.3; transform: rotate(45deg) scale(1); } 50% { opacity: 0.6; transform: rotate(45deg) scale(1.1); } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 20px #22c55e; } 50% { box-shadow: 0 0 30px #22c55e, 0 0 40px #22c55e; } }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideRight { 0% { left: -100%; } 100% { left: 200%; } }
        input::placeholder, select { color: rgba(255, 255, 255, 0.3) !important; }
        select option { background: #1a1d3a; color: white; }
      `}</style>
    </div>
  );
};

export default Fertilizer;