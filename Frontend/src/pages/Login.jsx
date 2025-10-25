import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { Link } from "react-router-dom";
import farmersImage from "../assets/farmer2.jpeg";

const Login = () => {
  const [formData, setFormData] = useState({
    contact: "",
    password: "",
  });
  const { login, error, isLoading } = useLogin();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData.contact, formData.password);
  };

  const isFormValid = () => {
    return formData.contact && formData.password;
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1000px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'flex',
            minHeight: '600px',
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
                backgroundImage: `url(${farmersImage})`,
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
                    Welcome back to <span style={{ color: '#4ade80' }}>FarmAssist</span>
                  </h1>
                  <p style={{
                    fontSize: '18px',
                    margin: 0,
                    opacity: 0.9,
                    lineHeight: '1.4',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                  }}>
                    Access smart farming tools and <span style={{ color: '#4ade80' }}>data-driven insights</span> for better yields
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Form Section */}
            <div style={{
              flex: '1',
              minWidth: '400px',
              padding: '60px 40px',
              backgroundColor: 'white',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <div>
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#1f2937',
                  margin: '0 0 8px 0'
                }}>
                  Login to Your Account
                </h2>
                <p style={{
                  fontSize: '16px',
                  color: '#6b7280',
                  margin: '0 0 32px 0'
                }}>
                  Enter your credentials to access your dashboard
                </p>

                <form onSubmit={handleSubmit} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Contact Number
                    </label>
                    <input
                      type="text"
                      name="contact"
                      placeholder="Enter your contact number"
                      value={formData.contact}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        transition: 'border-color 0.2s',
                        boxSizing: 'border-box'
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
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        transition: 'border-color 0.2s',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  {error && (
                    <div style={{
                      padding: '12px 16px',
                      backgroundColor: '#fee2e2',
                      border: '1px solid #fecaca',
                      borderRadius: '6px',
                      color: '#dc2626',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!isFormValid() || isLoading}
                    style={{
                      width: '100%',
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
                        Logging in...
                      </>
                    ) : (
                      'Login'
                    )}
                  </button>

                  <div style={{
                    textAlign: 'center',
                    marginTop: '8px'
                  }}>
                    <p style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      margin: 0
                    }}>
                      Don't have an account?{' '}
                      <Link to="/signup" style={{
                        color: '#16a34a',
                        textDecoration: 'none',
                        fontWeight: '600',
                        transition: 'color 0.2s'
                      }}>
                        Sign Up
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        input:focus {
          outline: none;
          border-color: #16a34a !important;
        }
        a:hover {
          color: #15803d !important;
        }
      `}</style>
    </div>
  );
};

export default Login;