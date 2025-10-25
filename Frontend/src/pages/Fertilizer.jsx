import React, { useState } from "react";
import fertilizerImage from "../assets/fertilizer.jpeg";
import FertilizerPrediction from "../components/FertilizerPrediction";

const Fertilizer = () => {
  const [formData, setFormData] = useState({
    temp: "",
    humid: "",
    mois: "",
    soil: "0",
    crop: "0",
    nitro: "",
    pota: "",
    phos: ""
  });
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const soilTypes = [
    { value: "0", label: "Black" },
    { value: "1", label: "Clayey" },
    { value: "2", label: "Loamy" },
    { value: "3", label: "Red" },
    { value: "4", label: "Sandy" }
  ];

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
      const res = await fetch(`${process.env.FERTILIZER_MODEL_URI}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          temp: parseFloat(formData.temp),
          humid: parseFloat(formData.humid),
          mois: parseFloat(formData.mois),
          soil: parseInt(formData.soil),
          crop: parseInt(formData.crop),
          nitro: parseFloat(formData.nitro),
          pota: parseFloat(formData.pota),
          phos: parseFloat(formData.phos)
        })
      });

      const result = await res.json();
      setPrediction(result.fertilizer || result.recommendation);
    } catch (err) {
      console.error("Prediction error:", err);
      setPrediction("Error getting prediction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return formData.temp && formData.humid && formData.mois && 
           formData.nitro && formData.pota && formData.phos;
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
                backgroundImage: `url(${fertilizerImage})`,
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
                    Get the <span style={{ color: '#4ade80' }}>right nutrients</span> for your crops
                  </h1>
                  <p style={{
                    fontSize: '18px',
                    margin: 0,
                    opacity: 0.9,
                    lineHeight: '1.4',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                  }}>
                    Smart fertilizer recommendations based on <span style={{ color: '#4ade80' }}>soil & crop data</span>
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
                  Fertilizer Recommendation
                </h2>
                <p style={{
                  fontSize: '16px',
                  color: '#6b7280',
                  margin: '0 0 24px 0'
                }}>
                  Enter your crop and soil details for personalized recommendations
                </p>

                <form onSubmit={handleSubmit} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  {/* Environmental Conditions */}
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
                        Temperature (°C)
                      </label>
                      <input
                        type="number"
                        name="temp"
                        value={formData.temp}
                        onChange={handleInputChange}
                        required
                        step="0.1"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px',
                          transition: 'border-color 0.2s'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        Humidity (%)
                      </label>
                      <input
                        type="number"
                        name="humid"
                        value={formData.humid}
                        onChange={handleInputChange}
                        required
                        step="0.1"
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

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Moisture (%)
                    </label>
                    <input
                      type="number"
                      name="mois"
                      value={formData.mois}
                      onChange={handleInputChange}
                      required
                      step="0.1"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  {/* Soil and Crop Type */}
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
                        Soil Type
                      </label>
                      <select
                        name="soil"
                        value={formData.soil}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px',
                          backgroundColor: 'white'
                        }}
                      >
                        {soilTypes.map(soil => (
                          <option key={soil.value} value={soil.value}>
                            {soil.label}
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
                        Crop Type
                      </label>
                      <select
                        name="crop"
                        value={formData.crop}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px',
                          backgroundColor: 'white'
                        }}
                      >
                        {cropTypes.map(crop => (
                          <option key={crop.value} value={crop.value}>
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
                        Nitrogen (N)
                      </label>
                      <input
                        type="number"
                        name="nitro"
                        value={formData.nitro}
                        onChange={handleInputChange}
                        required
                        step="0.1"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        Potassium (K)
                      </label>
                      <input
                        type="number"
                        name="pota"
                        value={formData.pota}
                        onChange={handleInputChange}
                        required
                        step="0.1"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        Phosphorus (P)
                      </label>
                      <input
                        type="number"
                        name="phos"
                        value={formData.phos}
                        onChange={handleInputChange}
                        required
                        step="0.1"
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
                      'Get Recommendation'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {prediction && (
          <FertilizerPrediction fertilizer={prediction} />
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

export default Fertilizer;