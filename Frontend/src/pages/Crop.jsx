import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import uploadIcon from "../assets/uploadIcon.png";
import UploadedFile from "../components/UploadedFile";
import PredictionBox from "../components/PredictionBox";
import { useTranslation } from "react-i18next";

const Crop = () => {
  const { t } = useTranslation();

  const farmersImage = "https://images.unsplash.com/photo-1515150144380-bca9f1650ed9?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  const [files, setFiles] = useState([]);
  const [prediction, setPrediction] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- Function to send images for prediction ---
  const getPrediction = async () => {
    setIsLoading(true);
    setPrediction([]);

    try {
      const promises = files.map(async (fileArr) => {
        const file = fileArr[0];
        console.log("Sending file for prediction:", file.name);

        const res = await fetch(`${import.meta.env.VITE_DISEASE_MODEL_URI}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: file.base64Data,
            name: file.name,
          }),
        });

        const result = await res.json();
        console.log("Received prediction result:", result);

        return {
          file_name: result.file_name,
          image_base64: file.base64Data,
          predicted_crop: result.predicted_crop,
          //crop_confidence: result.crop_confidence,
          predicted_disease: result.predicted_disease,
          //disease_confidence: result.disease_confidence,
          preventive_measures: result.preventive_measures,
          predicted_severity: result.predicted_severity,
          recommended_pesticides: result.recommended_pesticides
        };
      });

      const results = await Promise.all(promises);
      setPrediction(results);
    } catch (err) {
      console.error("Prediction error:", err);
      // Error message will be handled in PredictionBox or via toast
    } finally {
      setIsLoading(false);
    }
  };

  // --- File Upload Component ---
  const FileUpload = () => {
    const onDrop = (acceptedFiles) => {
      const convertedFiles = acceptedFiles.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              if (reader.readyState === FileReader.DONE) {
                const base64Data = reader.result.split(",")[1];
                resolve({
                  name: file.name,
                  type: file.type,
                  size: file.size,
                  base64Data,
                });
              }
            };
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
          })
      );

      Promise.all(convertedFiles)
        .then((base64Files) => {
          setFiles((prevfiles) => [...prevfiles, base64Files]);
        })
        .catch((error) => {
          console.error("Error converting files:", error);
        });
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: {
        "image/*": [".jpeg", ".jpg", ".png", ".gif", ".bmp", ".webp"],
      },
      multiple: true,
    });

    return (
      <div
        style={{
          display: "flex",
          gap: "24px",
          marginTop: "20px",
          flexWrap: "wrap",
        }}
      >
        {/* Upload Area */}
        <div
          {...getRootProps()}
          style={{
            flex: "1",
            minWidth: "300px",
            height: "220px",
            border: `2px dashed ${isDragActive ? "#22c55e" : "rgba(255, 255, 255, 0.2)"}`,
            borderRadius: "16px",
            backgroundColor: isDragActive ? "rgba(34, 197, 94, 0.1)" : "rgba(255, 255, 255, 0.05)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.4s ease",
            padding: "20px",
            backdropFilter: "blur(10px)",
            boxShadow: isDragActive ? "0 0 30px rgba(34, 197, 94, 0.3)" : "none",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <input {...getInputProps()} />
          <div style={{ 
            textAlign: "center", 
            zIndex: 1,
            animation: isDragActive ? "pulse 1.5s ease-in-out infinite" : "none"
          }}>
            <img
              src={uploadIcon}
              alt={t("upload_icon_alt")}
              style={{
                width: "56px",
                height: "56px",
                marginBottom: "16px",
                filter: "drop-shadow(0 0 10px rgba(34, 197, 94, 0.5))",
                transition: "all 0.3s ease",
                transform: isDragActive ? "scale(1.1)" : "scale(1)",
              }}
            />
            <p
              style={{
                margin: 0,
                fontSize: "18px",
                color: isDragActive ? "#22c55e" : "#ffffff",
                fontWeight: "600",
                textShadow: isDragActive ? "0 0 20px rgba(34, 197, 94, 0.5)" : "none",
              }}
            >
              {isDragActive ? t("drop_here") : t("drop_or_click")}
            </p>
            <p
              style={{
                margin: "8px 0 0 0",
                fontSize: "13px",
                color: "rgba(255, 255, 255, 0.6)",
                fontWeight: "500",
              }}
            >
              {t("supported_formats")}
            </p>
          </div>
          {isDragActive && (
            <div style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, transparent 70%)",
              animation: "ripple 1.5s ease-out infinite"
            }}></div>
          )}
        </div>

        {/* Uploaded Files and Upload Button */}
        <div
          style={{
            flex: "1",
            minWidth: "300px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {files.length > 0 && (
            <div
              style={{
                maxHeight: "140px",
                overflowY: "auto",
                padding: "12px",
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
              }}
            >
              {files.map((file, index) => (
                <UploadedFile key={index} file={file[0]} />
              ))}
            </div>
          )}

          <button
            onClick={getPrediction}
            disabled={files.length === 0 || isLoading}
            style={{
              padding: "16px 32px",
              background: files.length === 0 || isLoading 
                ? "rgba(255, 255, 255, 0.1)" 
                : "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
              color: files.length === 0 || isLoading ? "rgba(255, 255, 255, 0.4)" : "#ffffff",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "700",
              cursor: files.length === 0 || isLoading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              boxShadow: files.length === 0 || isLoading ? "none" : "0 0 30px rgba(34, 197, 94, 0.4)",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              if (files.length > 0 && !isLoading) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 0 40px rgba(34, 197, 94, 0.6)";
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = files.length === 0 || isLoading ? "none" : "0 0 30px rgba(34, 197, 94, 0.4)";
            }}
          >
            {!files.length || isLoading ? null : (
              <div style={{
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "100%",
                height: "100%",
                background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
                animation: "slideRight 3s ease-in-out infinite"
              }}></div>
            )}
            {isLoading ? (
              <>
                <div style={{
                  width: "18px",
                  height: "18px",
                  border: "3px solid rgba(255, 255, 255, 0.3)",
                  borderTop: "3px solid #ffffff",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite"
                }}></div>
                {t("analyzing")}
              </>
            ) : (
              <>
                {t("analyze_images", { count: files.length })}
                <span style={{ fontSize: "18px" }}>→</span>
              </>
            )}
          </button>
        </div>
      </div>
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
                  backdropFilter: 'blur(0px)'
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
                    {t("ai_powered_crop_guardian")}
                  </h1>
                  <p style={{
                    fontSize: '18px',
                    margin: 0,
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: '1.6',
                    animation: 'fadeInLeft 0.8s ease-out 0.2s backwards'
                  }}>
                    {t("upload_for_insights")}
                  </p>

                  {/* Stats */}
                  <div style={{
                    display: 'flex',
                    gap: '24px',
                    marginTop: '40px',
                    animation: 'fadeInLeft 0.8s ease-out 0.4s backwards'
                  }}>
                    {[
                      { label: t("diseases_detected"), value: '40+' },
                      { label: t("accuracy_rate"), value: '98.7%' },
                      { label: t("crops_supported"), value: '25+' }
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

            {/* Right Side - Upload & Analysis Section */}
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
                  {t("upload_and_analyze")}
                </h2>
                <p style={{
                  fontSize: '15px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  margin: '0 0 40px 0',
                  fontWeight: '400'
                }}>
                  {t("drop_images_tip")}
                </p>

                <FileUpload />

                {/* Quick Tips */}
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
                    <strong style={{ color: '#22c55e' }}>{t("pro_tip")}:</strong> {t("clear_images_tip")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Predictions Section - Outside Card */}
        {prediction.length > 0 && (
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
                {t("ai_diagnosis_complete")}
              </h2>
              <p style={{ 
                fontSize: '18px', 
                color: 'rgba(255, 255, 255, 0.7)', 
                margin: 0,
                fontWeight: '500'
              }}>
                {t("crops_analyzed", { count: prediction.length })}
              </p>
            </div>

            <div style={{ 
              display: "grid", 
              gap: "28px",
              padding: '0 20px'
            }}>
              {prediction.map((pred, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    overflow: 'hidden',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    animation: `fadeInUp 0.6s ease-out ${0.1 * index}s backwards`
                  }}
                >
                  <PredictionBox
                    file_name={pred.file_name}
                    image_base64={pred.image_base64}
                    predicted_crop={pred.predicted_crop}
                    //crop_confidence={pred.crop_confidence}
                    predicted_disease={pred.predicted_disease}
                    //disease_confidence={pred.disease_confidence}
                    preventive_measures={pred.preventive_measures}
                    predicted_severity={pred.predicted_severity}
                    recommended_pesticides={pred.recommended_pesticides}
                  />
                </div>
              ))}
            </div>

            {/* Action Buttons */}

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
        @keyframes ripple { 0% { transform: scale(0.8); opacity: 1; } 100% { transform: scale(2.4); opacity: 0; } }
        input::placeholder { color: rgba(255, 255, 255, 0.3); }
      `}</style>
    </div>
  );
};

export default Crop;