import React, { useState } from "react";
import yieldImage from "../assets/yield.jpg";

const Yield = () => {
  const [formData, setFormData] = useState({
    State_Name: "",
    Crop_Year: "",
    Season: "Kharif",
    Crop: "",
    Area: ""
  });
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const seasons = [
    "Kharif",
    "Rabi",
    "Whole Year",
    "Summer",
    "Winter",
    "Autumn"
  ];

  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal"
  ];

  const crops = [
    "Rice",
    "Wheat",
    "Maize",
    "Cotton",
    "Sugarcane",
    "Soyabean",
    "Groundnut",
    "Sunflower",
    "Jowar",
    "Bajra",
    "Ragi",
    "Moong",
    "Urad",
    "Arhar/Tur",
    "Masoor",
    "Gram",
    "Rapeseed & Mustard",
    "Safflower",
    "Sesamum",
    "Nigerseed",
    "Castorseed",
    "Linseed",
    "Coconut",
    "Dry Chillies",
    "Turmeric",
    "Coriander",
    "Garlic",
    "Ginger",
    "Onion",
    "Potato",
    "Sweet Potato",
    "Tapioca",
    "Banana",
    "Papaya",
    "Mango",
    "Orange",
    "Apple",
    "Grapes",
    "Pomegranate",
    "Arecanut",
    "Cashewnut",
    "Tea",
    "Coffee",
    "Rubber",
    "Tobacco",
    "Jute",
    "Mesta"
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
      const res = await fetch(`${process.env.YIELD_MODEL_URI}/predict_yield`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          State_Name: formData.State_Name,
          Crop_Year: parseInt(formData.Crop_Year),
          Season: formData.Season,
          Crop: formData.Crop,
          Area: parseInt(formData.Area)
        })
      });

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
    return formData.State_Name && formData.Crop_Year && formData.Season && 
           formData.Crop && formData.Area;
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        {/* Header Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
          marginBottom: '40px'
        }}>
          <div style={{
            display: 'flex',
            minHeight: '500px',
            flexWrap: 'wrap'
          }}>
            {/* Left Side - Hero Section */}
            <div style={{
              flex: '1',
              minWidth: '400px',
              display: 'flex',
              position: 'relative'
            }}>
              <div style={{
                flex: '1',
                backgroundImage: `url(${yieldImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 100%)'
                }}></div>
              </div>
              
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                padding: '40px',
                zIndex: 1
              }}>
                <div style={{
                  color: 'white',
                  maxWidth: '400px'
                }}>
                  <h1 style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    lineHeight: '1.2',
                    margin: '0 0 16px 0',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
                  }}>
                    Predict your <span style={{ color: '#4ade80' }}>crop yield</span> accurately
                  </h1>
                  <p style={{
                    fontSize: '18px',
                    margin: 0,
                    opacity: 0.9,
                    lineHeight: '1.4',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                  }}>
                    Get precise yield estimates based on <span style={{ color: '#4ade80' }}>location & season data</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Form Section */}
            <div style={{
              flex: '1',
              minWidth: '400px',
              padding: '40px',
              backgroundColor: 'white'
            }}>
              <div>
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#1f2937',
                  margin: '0 0 8px 0'
                }}>
                  Crop Yield Prediction
                </h2>
                <p style={{
                  fontSize: '16px',
                  color: '#6b7280',
                  margin: '0 0 24px 0'
                }}>
                  Enter your crop and location details for accurate yield estimates
                </p>

                <form onSubmit={handleSubmit} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  {/* State and Year */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        State
                      </label>
                      <select
                        name="State_Name"
                        value={formData.State_Name}
                        onChange={handleInputChange}
                        required
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px',
                          backgroundColor: 'white'
                        }}
                      >
                        <option value="">Select State</option>
                        {states.map(state => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        Crop Year
                      </label>
                      <input
                        type="number"
                        name="Crop_Year"
                        value={formData.Crop_Year}
                        onChange={handleInputChange}
                        required
                        min="1997"
                        max="2030"
                        placeholder="e.g., 2024"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  </div>

                  {/* Season and Crop */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        Season
                      </label>
                      <select
                        name="Season"
                        value={formData.Season}
                        onChange={handleInputChange}
                        required
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px',
                          backgroundColor: 'white'
                        }}
                      >
                        {seasons.map(season => (
                          <option key={season} value={season}>
                            {season}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        Crop
                      </label>
                      <select
                        name="Crop"
                        value={formData.Crop}
                        onChange={handleInputChange}
                        required
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px',
                          backgroundColor: 'white'
                        }}
                      >
                        <option value="">Select Crop</option>
                        {crops.map(crop => (
                          <option key={crop} value={crop}>
                            {crop}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Area */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Area (in hectares)
                    </label>
                    <input
                      type="number"
                      name="Area"
                      value={formData.Area}
                      onChange={handleInputChange}
                      required
                      min="1"
                      step="0.01"
                      placeholder="e.g., 10.5"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!isFormValid() || isLoading}
                    style={{
                      marginTop: '8px',
                      padding: '12px 24px',
                      backgroundColor: !isFormValid() || isLoading ? '#d1d5db' : '#16a34a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: !isFormValid() || isLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    {isLoading ? (
                      <>
                        <div style={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid #ffffff',
                          borderTop: '2px solid transparent',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }}></div>
                        Analyzing...
                      </>
                    ) : (
                      'Predict Yield'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Prediction Result Card */}
        {prediction && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            padding: '40px',
            textAlign: 'center'
          }}>
            <div style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#dcfce7',
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              <span style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#16a34a',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Predicted Yield
              </span>
            </div>
            
            <h3 style={{
              fontSize: '48px',
              fontWeight: '700',
              color: '#1f2937',
              margin: '0 0 8px 0'
            }}>
              {typeof prediction === 'number' ? prediction.toFixed(2) : prediction}
              {typeof prediction === 'number' && (
                <span style={{
                  fontSize: '24px',
                  fontWeight: '500',
                  color: '#6b7280',
                  marginLeft: '8px'
                }}>
                  tonnes/hectare
                </span>
              )}
            </h3>
            
            <p style={{
              fontSize: '16px',
              color: '#6b7280',
              margin: '16px 0 0 0'
            }}>
              {typeof prediction === 'number' 
                ? `Based on your inputs for ${formData.Crop} in ${formData.State_Name}`
                : 'Please try again with different parameters'}
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        input:focus, select:focus {
          outline: none;
          border-color: #16a34a !important;
        }
      `}</style>
    </div>
  );
};

export default Yield;