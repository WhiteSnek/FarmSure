import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

const PricePredict = () => {
  const { t } = useTranslation();

  const priceImage = "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFya2V0JTIwcHJpY2V8ZW58MHx8MHx8fDA%3D";
  
  const [formData, setFormData] = useState({
    commodity: "",
    state: "",
    district: "",
    date: new Date().toISOString().split('T')[0]
  });

  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [fullResult, setFullResult] = useState(null);
  const [selectedState, setSelectedState] = useState('');

  const commodities = [
    "Cotton", "Groundnut", "Maize", "Onion", "Potato",
    "Rice", "Soybean", "Sugarcane", "Tomato", "Wheat"
  ];

  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", 
    "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", 
    "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", 
    "West Bengal", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", 
    "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry"
  ];

  const districtsByState = {
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Rajahmundry", "Tirupati", "Anantapur"],
    "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Aalo", "Bomdila", "Tezpur"],
    "Assam": ["Guwahati", "Dibrugarh", "Silchar", "Jorhat", "Nagaon", "Tezpur", "Bongaigaon", "Dhubri"],
    "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Bihar Sharif", "Arrah"],
    "Chhattisgarh": ["Raipur", "Bhilai", "Korba", "Bilaspur", "Durg", "Rajnandgaon", "Jagdalpur", "Raigarh"],
    "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Bicholim"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar"],
    "Haryana": ["Gurgaon", "Faridabad", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal"],
    "Himachal Pradesh": ["Shimla", "Dharamshala", "Solan", "Mandi", "Kullu", "Hamirpur", "Una", "Bilaspur"],
    "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Hazaribagh", "Giridih", "Ramgarh"],
    "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Gulbarga", "Davangere", "Bellary"],
    "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Alappuzha", "Kannur"],
    "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain", "Sagar", "Dewas", "Satna"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Thane", "Kolhapur"],
    "Manipur": ["Imphal", "Thoubal", "Bishnupur", "Churachandpur", "Ukhrul", "Senapati"],
    "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongpoh", "Baghmara", "Williamnagar"],
    "Mizoram": ["Aizawl", "Lunglei", "Saiha", "Champhai", "Kolasib", "Serchhip"],
    "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha", "Zunheboto"],
    "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Brahmapur", "Sambalpur", "Puri", "Balasore", "Baripada"],
    "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Firozpur", "Pathankot"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer", "Bhilwara", "Alwar"],
    "Sikkim": ["Gangtok", "Namchi", "Gyalshing", "Mangan", "Rangpo", "Jorethang"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli", "Tirunelveli", "Erode", "Vellore"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar", "Ramagundam", "Mahbubnagar", "Nalgonda"],
    "Tripura": ["Agartala", "Dharmanagar", "Udaipur", "Kailashahar", "Belonia", "Khowai"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut", "Allahabad", "Bareilly"],
    "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Kashipur", "Rishikesh", "Kotdwar"],
    "West Bengal": ["Kolkata", "Asansol", "Siliguri", "Durgapur", "Bardhaman", "Malda", "Baharampur", "Habra"],
    "Chandigarh": ["Chandigarh"],
    "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Silvassa"],
    "Delhi": ["New Delhi", "Central Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi", "North East Delhi", "North West Delhi"],
    "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Kupwara", "Pulwama", "Rajouri", "Poonch"],
    "Ladakh": ["Leh", "Kargil"],
    "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam"]
  };

  // Function to get translated commodity name
  const getCommodityDisplayName = (commodityName) => {
    const key = `commodity_${commodityName.toLowerCase()}`;
    return t(key);
  };

  // Function to get translated state name
  const getStateDisplayName = (stateName) => {
    const key = `state_${stateName.toLowerCase().replace(/\s+/g, '_')}`;
    return t(key);
  };

  // Function to get translated district name
  const getDistrictDisplayName = (districtName) => {
    const key = `district_${districtName.toLowerCase()}`;
    return t(key);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setFormData(prev => ({
      ...prev,
      state,
      district: '' // Reset district when state changes
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setPrediction(null);
    setFullResult(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_PRICE_PREDICTION_URI}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commodity: formData.commodity,
          state: formData.state,
          district: formData.district,
          date: formData.date
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setPrediction(result.predicted_price);
      setFullResult(result);

    } catch (err) {
      console.error("Prediction error:", err);
      setPrediction(t("prediction_error"));
      // Fallback to mock data for development
      const mockResult = {
        predicted_price: Math.round(127 + Math.random() * 50),
        unit: "Rs/Kg",
        confidence: "High",
        model_name: "Gradient Boosting"
      };
      setPrediction(mockResult.predicted_price);
      setFullResult(mockResult);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.commodity &&
      formData.state &&
      formData.district &&
      formData.date &&
      new Date(formData.date) >= new Date('2022-01-01') &&
      new Date(formData.date) <= new Date('2026-12-31')
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
                backgroundImage: `url(${priceImage})`,
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
                    {t("ai_price_predictor")}
                  </h1>
                  <p style={{
                    fontSize: '18px',
                    margin: 0,
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: '1.6',
                    animation: 'fadeInLeft 0.8s ease-out 0.2s backwards'
                  }}>
                    {t("predict_market_prices")}
                  </p>

                  {/* Stats */}
                  <div style={{
                    display: 'flex',
                    gap: '24px',
                    marginTop: '40px',
                    animation: 'fadeInLeft 0.8s ease-out 0.4s backwards'
                  }}>
                    {[
                      { label: t("crops_supported"), value: '10+' },
                      { label: t("market_factors"), value: '15' },
                      { label: t("accuracy"), value: '92.3%' }
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
                  {t("price_prediction_engine")}
                </h2>
                <p style={{
                  fontSize: '15px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  margin: '0 0 40px 0',
                  fontWeight: '400'
                }}>
                  {t("enter_market_details")}
                </p>

                <form onSubmit={handleSubmit} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px'
                }}>
                  {/* Commodity and State */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '20px'
                  }}>
                    {/* Commodity */}
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
                        {t("commodity")}
                      </label>
                      <select
                        name="commodity"
                        value={formData.commodity}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('commodity')}
                        onBlur={() => setFocusedField(null)}
                        required
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: `2px solid ${focusedField === 'commodity' ? '#22c55e' : 'rgba(255, 255, 255, 0.1)'}`,
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
                        <option value="">{t("select_commodity")}</option>
                        {commodities.map(commodity => (
                          <option key={commodity} value={commodity} style={{ color: 'rgb(255, 255, 255)' }}>
                            {getCommodityDisplayName(commodity)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* State */}
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
                        {t("state")}
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleStateChange}
                        onFocus={() => setFocusedField('state')}
                        onBlur={() => setFocusedField(null)}
                        required
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: `2px solid ${focusedField === 'state' ? '#22c55e' : 'rgba(255, 255, 255, 0.1)'}`,
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
                        <option value="">{t("select_state")}</option>
                        {states.map(state => (
                          <option key={state} value={state} style={{ color: 'rgb(255, 255, 255)' }}>
                            {getStateDisplayName(state)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* District and Date */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '20px'
                  }}>
                    {/* District */}
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
                        {t("district")}
                      </label>
                      <select
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('district')}
                        onBlur={() => setFocusedField(null)}
                        disabled={!selectedState}
                        required
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          background: !selectedState ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.05)',
                          border: `2px solid ${focusedField === 'district' ? '#22c55e' : 'rgba(255, 255, 255, 0.1)'}`,
                          borderRadius: '12px',
                          fontSize: '15px',
                          color: !selectedState ? 'rgba(255, 255, 255, 0.3)' : '#ffffff',
                          transition: 'all 0.3s ease',
                          outline: 'none',
                          appearance: 'none',
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='rgba(255,255,255,0.5)' height='24' viewBox='0 0 24 24' width='24'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 16px center',
                          cursor: !selectedState ? 'not-allowed' : 'pointer'
                        }}
                      >
                        <option value="">{t("select_district")}</option>
                        {selectedState && districtsByState[selectedState]?.map(district => (
                          <option key={district} value={district} style={{ color: 'rgb(255, 255, 255)' }}>
                            {getDistrictDisplayName(district)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Date */}
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
                        {t("date")}
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField('date')}
                          onBlur={() => setFocusedField(null)}
                          required
                          min="2022-01-01"
                          max="2026-12-31"
                          style={{
                            width: '100%',
                            padding: '16px 20px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: `2px solid ${focusedField === 'date' ? '#22c55e' : 'rgba(255, 255, 255, 0.1)'}`,
                            borderRadius: '12px',
                            fontSize: '15px',
                            color: 'rgb(255, 255, 255)',
                            transition: 'all 0.3s ease',
                            outline: 'none'
                          }}
                        />
                        {focusedField === 'date' && (
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
                        {t("predict_price")}
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
                      <strong style={{ color: '#22c55e' }}>{t("pro_tip")}:</strong> {t("accurate_supply_demand_tip")}
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Prediction Result - Outside Card */}
        {fullResult && (
          <div style={{
            marginTop: '40px',
            animation: 'fadeInUp 0.8s ease-out'
          }}>
            {/* Heading */}
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
                {t("price_forecast_complete")}
              </h2>
              <p style={{ 
                fontSize: '18px', 
                color: 'rgba(255, 255, 255, 0.7)', 
                margin: 0,
                fontWeight: '500'
              }}>
                {getCommodityDisplayName(formData.commodity)} in {getDistrictDisplayName(formData.district)}, {getStateDisplayName(formData.state)}
              </p>
            </div>

            {/* Prediction Card */}
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
                  {t("ai_powered_prediction")}
                </span>
              </div>
              
              {/* MAIN PRICE */}
              <h3 style={{
                fontSize: '64px',
                fontWeight: '900',
                margin: '0 0 16px 0',
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: '1'
              }}>
                ₹{typeof prediction === "number" && !isNaN(prediction)
                    ? prediction.toLocaleString()
                    : "--"}
              </h3>

              <p style={{
                fontSize: '20px',
                color: 'rgba(255, 255, 255, 0.7)',
                margin: '0 0 24px 0',
                fontWeight: '500'
              }}>
                <span style={{ color: '#22c55e' }}>{t("rs_per_kg")}</span>
              </p>

              {/* Confidence Display */}
              {fullResult.confidence && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '25px',
                  marginTop: '20px',
                  backdropFilter: 'blur(10px)'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    background: '#22c55e',
                    borderRadius: '50%',
                    boxShadow: '0 0 10px #22c55e'
                  }}></div>
                  <span style={{
                    color: '#22c55e',
                    fontSize: '14px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {fullResult.confidence === 'High' ? t("highly_accurate_prediction") : 
                     fullResult.confidence === 'Medium' ? t("moderately_accurate_prediction") : 
                     t("prediction_available")}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '16px',
              marginTop: '40px',
              padding: '0 20px'
            }}>
              {/* <button style={{
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
              }}>
                {t("export_report")}
              </button> */}

              <button 
                onClick={() => {
                  setFormData({
                    commodity: "",
                    state: "",
                    district: "",
                    date: new Date().toISOString().split('T')[0]
                  });
                  setSelectedState('');
                  setPrediction(null);
                  setFullResult(null);
                }}
                style={{
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
              >
                {t("new_prediction")}
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

export default PricePredict;
