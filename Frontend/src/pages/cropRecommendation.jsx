import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTranslation } from "react-i18next";

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const CropRecommendation = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    location: null,
    rainfall: "",
    ph: "",
    nitrogen: "",
    potassium: "",
    fieldSize: ""
  });
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // India
  const [markerPosition, setMarkerPosition] = useState(null);

  const cities = [
    { name: "Surat", coords: [21.170240, 72.831062] },
    { name: "Delhi", coords: [28.6139, 77.2090] },
    { name: "Mumbai", coords: [19.0760, 72.8777] },
    { name: "Bangalore", coords: [12.9716, 77.5946] },
    { name: "Chennai", coords: [13.0827, 80.2707] },
    { name: "Kolkata", coords: [22.5726, 88.3639] },
    { name: "Hyderabad", coords: [17.3850, 78.4867] },
    { name: "Pune", coords: [18.5204, 73.8567] },
    { name: "Jaipur", coords: [26.9124, 75.7873] },
    { name: "Lucknow", coords: [26.8467, 80.9462] },
    { name: "Patna", coords: [25.5941, 85.1376] },
    { name: "Bhopal", coords: [23.2599, 77.4126] },
    { name: "Chandigarh", coords: [30.7333, 76.7794] },
    { name: "Indore", coords: [22.7196, 75.8577] },
    { name: "Nagpur", coords: [21.1458, 79.0882] },
    { name: "Coimbatore", coords: [11.0168, 76.9558] },
    { name: "Ludhiana", coords: [30.9010, 75.8573] },
    { name: "Kanpur", coords: [26.4499, 80.3319] },
    { name: "Ahmedabad", coords: [23.0225, 72.5714] },
    { name: "Visakhapatnam", coords: [17.6868, 83.2185] },
    { name: "Thiruvananthapuram", coords: [8.5241, 76.9366] }
  ];

  const handleLocationChange = (e) => {
    const selectedCity = cities.find(city => city.name === e.target.value);
    if (selectedCity) {
      setFormData(prev => ({ ...prev, location: selectedCity.name }));
      setMapCenter(selectedCity.coords);
      setMarkerPosition(selectedCity.coords);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setPrediction(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_CROP_MODEL_URI}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: formData.location,
          pH: parseFloat(formData.ph),
          nitro: parseFloat(formData.nitrogen),
          phos: parseFloat(formData.fieldSize),
          pota: parseFloat(formData.potassium),
        })
      });
      const result = await res.json();
      setPrediction({
        crop: result.crop,
        market: result.market_data || []
      });
    } catch (err) {
      setPrediction({ error: t("prediction_error") });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return formData.location && formData.ph && 
           formData.nitrogen && formData.potassium && formData.fieldSize;
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
      {/* Floating Orbs */}
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
        maxWidth: '1400px',
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
            minHeight: '720px',
            flexWrap: 'wrap'
          }}>
            {/* LEFT: Hero + Map */}
            <div style={{
              flex: '1',
              minWidth: '500px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, rgba(10, 14, 39, 0) 0%, rgba(26, 29, 58, 0.24) 50%, rgba(15, 23, 41, 0.9) 100%)',
                backdropFilter: 'blur(2px)',
                zIndex: 1
              }}></div>

              <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                <MapContainer 
                  center={mapCenter} 
                  zoom={5} 
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  {markerPosition && (
                    <Marker position={markerPosition}>
                      <Popup>{formData.location}</Popup>
                    </Marker>
                  )}
                </MapContainer>
              </div>

              <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                width: '60px',
                height: '60px',
                border: '2px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '12px',
                transform: 'rotate(45deg)',
                animation: 'pulse 3s ease-in-out infinite',
                zIndex: 2
              }}></div>

              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                padding: '60px 50px',
                zIndex: 2
              }}>
                <div style={{ color: 'white', maxWidth: '500px' }}>
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
                    <span style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '0.5px' }}>
                      FarmSure
                    </span>
                  </div>

                  <h1 style={{
                    fontSize: '48px',
                    fontWeight: '800',
                    lineHeight: '1.1',
                    margin: '0 0 24px 0',
                    background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    {t("smart_crop_selector")}
                  </h1>
                  <p style={{
                    fontSize: '18px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: '1.6',
                    margin: 0
                  }}>
                    {t("discover_perfect_crops")}
                  </p>

                  <div style={{ display: 'flex', gap: '24px', marginTop: '40px' }}>
                    {[
                      { label: t("crops_analyzed"), value: '50+' },
                      { label: t("parameters"), value: '6' },
                      { label: t("accuracy"), value: '98.7%' }
                    ].map((stat, i) => (
                      <div key={i} style={{
                        padding: '16px 20px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}>
                        <div style={{ fontSize: '24px', fontWeight: '700', color: '#22c55e' }}>
                          {stat.value}
                        </div>
                        <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Form */}
            <div style={{
              flex: '1',
              minWidth: '500px',
              padding: '70px 50px',
              background: 'rgba(15, 23, 41, 0.6)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'relative'
            }}>
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

              <div>
                <h2 style={{
                  fontSize: '36px',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  margin: '0 0 12px 0',
                  letterSpacing: '-0.5px'
                }}>
                  {t("crop_recommendation_engine")}
                </h2>
                <p style={{
                  fontSize: '15px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  margin: '0 0 40px 0',
                  fontWeight: '400'
                }}>
                  {t("enter_field_data")}
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Location */}
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
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='rgba(255,255,255,0.7)' height='24' viewBox='0 0 24 24' width='24'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 16px center',
                        cursor: 'pointer',
                        backgroundColor: '#0f172a',
                      }}
                    >
                      <option value="">{t("select_city")}</option>
                      {cities.map(city => (
                        <option key={city.name} value={city.name}>{city.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Soil pH */}
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
                      {t("soil_ph")}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="number"
                        name="ph"
                        value={formData.ph}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('ph')}
                        onBlur={() => setFocusedField(null)}
                        required
                        step="0.1"
                        min="0"
                        max="14"
                        placeholder={t("ph_placeholder")}
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: `2px solid ${focusedField === 'ph' ? '#22c55e' : 'rgba(255, 255, 255, 0.1)'}`,
                          borderRadius: '12px',
                          fontSize: '15px',
                          color: '#ffffff',
                          transition: 'all 0.3s ease',
                          outline: 'none'
                        }}
                      />
                      {focusedField === 'ph' && (
                        <div style={{
                          position: 'absolute',
                          bottom: '-2px',
                          left: 0,
                          right: 0,
                          height: '2px',
                          background: 'linear-gradient(90deg, transparent, #22c55e, transparent)',
                          animation: 'shimmer 2s ease-in-out infinite'
                        }}></div>
                      )}
                    </div>
                  </div>

                  {/* Nitrogen & Potassium */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
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
                        {t("nitrogen_ppm")}
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="number"
                          name="nitrogen"
                          value={formData.nitrogen}
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField('nitrogen')}
                          onBlur={() => setFocusedField(null)}
                          required
                          step="0.1"
                          placeholder={t("nitrogen_placeholder")}
                          style={{
                            width: '100%',
                            padding: '16px 20px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: `2px solid ${focusedField === 'nitrogen' ? '#22c55e' : 'rgba(255, 255, 255, 0.1)'}`,
                            borderRadius: '12px',
                            fontSize: '15px',
                            color: '#ffffff',
                            transition: 'all 0.3s ease',
                            outline: 'none'
                          }}
                        />
                        {focusedField === 'nitrogen' && (
                          <div style={{
                            position: 'absolute',
                            bottom: '-2px',
                            left: 0,
                            right: 0,
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
                        {t("potassium_ppm")}
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="number"
                          name="potassium"
                          value={formData.potassium}
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField('potassium')}
                          onBlur={() => setFocusedField(null)}
                          required
                          step="0.1"
                          placeholder={t("potassium_placeholder")}
                          style={{
                            width: '100%',
                            padding: '16px 20px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: `2px solid ${focusedField === 'potassium' ? '#22c55e' : 'rgba(255, 255, 255, 0.1)'}`,
                            borderRadius: '12px',
                            fontSize: '15px',
                            color: '#ffffff',
                            transition: 'all 0.3s ease',
                            outline: 'none'
                          }}
                        />
                        {focusedField === 'potassium' && (
                          <div style={{
                            position: 'absolute',
                            bottom: '-2px',
                            left: 0,
                            right: 0,
                            height: '2px',
                            background: 'linear-gradient(90deg, transparent, #22c55e, transparent)',
                            animation: 'shimmer 2s ease-in-out infinite'
                          }}></div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Phosphorus */}
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
                      {t("phosphorus_ppm")}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="number"
                        name="fieldSize"
                        value={formData.fieldSize}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('fieldSize')}
                        onBlur={() => setFocusedField(null)}
                        required
                        min="0.1"
                        step="0.01"
                        placeholder={t("phosphorus_placeholder")}
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: `2px solid ${focusedField === 'fieldSize' ? '#22c55e' : 'rgba(255, 255, 255, 0.1)'}`,
                          borderRadius: '12px',
                          fontSize: '15px',
                          color: '#ffffff',
                          transition: 'all 0.3s ease',
                          outline: 'none'
                        }}
                      />
                      {focusedField === 'fieldSize' && (
                        <div style={{
                          position: 'absolute',
                          bottom: '-2px',
                          left: 0,
                          right: 0,
                          height: '2px',
                          background: 'linear-gradient(90deg, transparent, #22c55e, transparent)',
                          animation: 'shimmer 2s ease-in-out infinite'
                        }}></div>
                      )}
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
                        {t("recommend_crops")}
                        <span style={{ fontSize: '18px' }}>→</span>
                      </>
                    )}
                  </button>

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
                      <strong style={{ color: '#22c55e' }}>{t("pro_tip")}:</strong> {t("soil_test_tip")}
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* RESULTS SECTION */}
        {prediction && !prediction.error && (
          <div style={{ marginTop: "40px", animation: "fadeInUp 0.8s ease-out" }}>
            <div style={{ textAlign: "center", marginBottom: "40px", padding: "0 20px" }}>
              <h2 style={{
                fontSize: "42px",
                fontWeight: "800",
                background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                margin: "0 0 12px 0",
                letterSpacing: "-1px",
              }}>
                {t("ai_crop_recommendations")}
              </h2>
            </div>

            <div style={{
              background: "rgba(255, 255, 255, 0.03)",
              backdropFilter: "blur(20px)",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              padding: "50px 40px",
              margin: "0 20px",
            }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "24px",
              }}>
                {/* Top Crop */}
                <div style={{
                  background: "rgba(34, 197, 94, 0.1)",
                  border: "1px solid rgba(34, 197, 94, 0.2)",
                  borderRadius: "16px",
                  padding: "24px",
                  textAlign: "center",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-4px)";
                  e.target.style.boxShadow = "0 10px 30px rgba(34, 197, 94, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}>
                  <div style={{
                    width: "60px",
                    height: "60px",
                    background: "rgba(34, 197, 94, 0.2)",
                    borderRadius: "50%",
                    margin: "0 auto 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "28px",
                  }}>
                    ★
                  </div>
                  <h4 style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "#ffffff",
                    margin: "0 0 8px 0",
                  }}>
                    {prediction.crop}
                  </h4>
                  <p style={{
                    fontSize: "14px",
                    color: "rgba(255, 255, 255, 0.7)",
                    margin: 0,
                  }}>
                    {t("top_recommendation")}
                  </p>
                </div>

                {/* Market Prices */}
                {prediction.market && prediction.market.length > 0 && (
                  <div style={{
                    background: "rgba(34, 197, 94, 0.1)",
                    border: "1px solid rgba(34, 197, 94, 0.2)",
                    borderRadius: "16px",
                    padding: "24px",
                    backdropFilter: "blur(10px)",
                  }}>
                    <h3 style={{
                      fontSize: "20px",
                      color: "#22c55e",
                      textAlign: "center",
                      marginBottom: "15px",
                      fontWeight: "700",
                    }}>
                      {t("market_prices") || "Market Prices"}
                    </h3>
                    {prediction.market.map((mkt, index) => (
                      <div key={index} style={{
                        marginBottom: "12px",
                        padding: "14px",
                        borderRadius: "12px",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}>
                        <div style={{
                          color: "white",
                          fontSize: "16px",
                          fontWeight: "600",
                          marginBottom: "6px",
                        }}>
                          {mkt.market}, {mkt.district}
                        </div>
                        <div style={{
                          color: "rgba(255,255,255,0.8)",
                          fontSize: "14px",
                          lineHeight: "1.4",
                        }}>
                          <div>Min: <span style={{ color: "#22c55e" }}>₹{mkt.min_price}</span></div>
                          <div>Max: <span style={{ color: "#22c55e" }}>₹{mkt.max_price}</span></div>
                          <div>Modal: <span style={{ color: "#22c55e" }}>₹{mkt.modal_price}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "16px",
              marginTop: "40px",
              padding: "0 20px",
            }}>
              <button style={{
                padding: "14px 32px",
                background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                color: "#ffffff",
                border: "none",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 0 30px rgba(34, 197, 94, 0.4)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}>
                {t("save_plan")}
              </button>

              <button style={{
                padding: "14px 32px",
                background: "rgba(255, 255, 255, 0.1)",
                color: "#ffffff",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.3s ease",
                backdropFilter: "blur(10px)",
              }}
              onClick={() => {
                setPrediction(null);
                setFormData({ location: null, rainfall: "", ph: "", nitrogen: "", potassium: "", fieldSize: "" });
                setMapCenter([20.5937, 78.9629]);
                setMarkerPosition(null);
              }}>
                {t("new_analysis")}
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {prediction?.error && (
          <div style={{
            marginTop: "40px",
            padding: "20px",
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "12px",
            textAlign: "center",
            color: "#fca5a5"
          }}>
            {prediction.error}
          </div>
        )}
      </div>

      {/* ANIMATIONS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 0.3; transform: rotate(45deg) scale(1); } 50% { opacity: 0.6; transform: rotate(45deg) scale(1.1); } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 20px #22c55e; } 50% { box-shadow: 0 0 30px #22c55e, 0 0 40px #22c55e; } }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @keyframes slideRight { 0% { left: -100%; } 100% { left: 200%; } }
        .leaflet-container { border-radius: 16px; }
      `}</style>
    </div>
  );
};

export default CropRecommendation;