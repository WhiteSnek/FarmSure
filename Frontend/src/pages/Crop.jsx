import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import farmersImage from "../assets/farmer.jpeg";
import uploadIcon from "../assets/uploadIcon.png";
import UploadedFile from "../components/UploadedFile";
import PredictionBox from "../components/PredictionBox";

const Crop = () => {
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

        const res = await fetch(`${process.env.DISEASE_MODEL_URI}/model/predict`, {
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
          crop_confidence: result.crop_confidence,
          predicted_disease: result.predicted_disease,
          disease_confidence: result.disease_confidence,
          preventive_measures: result.preventive_measures,
          description: result.description,
        };
      });

      const results = await Promise.all(promises);
      setPrediction(results);
    } catch (err) {
      console.error("Prediction error:", err);
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
            height: "200px",
            border: `2px dashed ${isDragActive ? "#3b82f6" : "#d1d5db"}`,
            borderRadius: "12px",
            backgroundColor: isDragActive ? "#eff6ff" : "#fafafa",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
            padding: "20px",
          }}
        >
          <input {...getInputProps()} />
          <div style={{ textAlign: "center" }}>
            <img
              src={uploadIcon}
              alt="Upload"
              style={{
                width: "48px",
                height: "48px",
                marginBottom: "12px",
                opacity: isDragActive ? 1 : 0.7,
              }}
            />
            <p
              style={{
                margin: 0,
                fontSize: "16px",
                color: isDragActive ? "#3b82f6" : "#6b7280",
                fontWeight: "500",
              }}
            >
              {isDragActive ? "Drop files here..." : "Drop your files here or browse"}
            </p>
            <p
              style={{
                margin: "4px 0 0 0",
                fontSize: "12px",
                color: "#9ca3af",
              }}
            >
              Supports: JPG, PNG, GIF, BMP, WebP
            </p>
          </div>
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
                maxHeight: "120px",
                overflowY: "auto",
                padding: "8px",
                backgroundColor: "#f9fafb",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
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
              padding: "12px 24px",
              backgroundColor:
                files.length === 0 || isLoading ? "#d1d5db" : "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: files.length === 0 || isLoading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {isLoading ? (
              <>
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid #ffffff",
                    borderTop: "2px solid transparent",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                ></div>
                Analyzing...
              </>
            ) : (
              `Analyze ${files.length} Image${files.length !== 1 ? "s" : ""}`
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px 20px",
        }}
      >
        {/* Header Section */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            overflow: "hidden",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              minHeight: "400px",
              flexWrap: "wrap",
            }}
          >
            {/* Left Side - Hero */}
            <div
              style={{
                flex: "1",
                minWidth: "400px",
                display: "flex",
                position: "relative",
              }}
            >
              <div
                style={{
                  flex: "1",
                  backgroundImage: `url(${farmersImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 100%)",
                  }}
                ></div>
              </div>

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  padding: "40px",
                  zIndex: 1,
                }}
              >
                <div style={{ color: "white", maxWidth: "400px" }}>
                  <h1
                    style={{
                      fontSize: "32px",
                      fontWeight: "700",
                      lineHeight: "1.2",
                      margin: "0 0 16px 0",
                      textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
                    }}
                  >
                    Let <span style={{ color: "#60a5fa" }}>technology</span> watch
                    over your fields.
                  </h1>
                  <p
                    style={{
                      fontSize: "18px",
                      margin: 0,
                      opacity: 0.9,
                      lineHeight: "1.4",
                      textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
                    }}
                  >
                    You <span style={{ color: "#60a5fa" }}>focus</span> on growth,
                    we'll handle the threats.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Upload Section */}
            <div
              style={{
                flex: "1",
                minWidth: "400px",
                padding: "40px",
                backgroundColor: "white",
              }}
            >
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: "700",
                  color: "#1f2937",
                  margin: "0 0 8px 0",
                }}
              >
                File Upload
              </h2>
              <p
                style={{
                  fontSize: "16px",
                  color: "#6b7280",
                  margin: "0 0 24px 0",
                }}
              >
                Upload at least 3 images of your crops for analysis
              </p>
              <FileUpload />
            </div>
          </div>
        </div>

        {/* Predictions Section */}
        {prediction.length > 0 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <h2
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  color: "#1f2937",
                  margin: "0 0 8px 0",
                }}
              >
                Analysis Results
              </h2>
              <p style={{ fontSize: "16px", color: "#6b7280", margin: 0 }}>
                AI-powered crop health assessment
              </p>
            </div>

            <div style={{ display: "grid", gap: "24px" }}>
              {prediction.map((pred, index) => (
                <PredictionBox
                  key={index}
                  file_name={pred.file_name}
                  image_base64={pred.image_base64}
                  predicted_crop={pred.predicted_crop}
                  crop_confidence={pred.crop_confidence}
                  predicted_disease={pred.predicted_disease}
                  disease_confidence={pred.disease_confidence}
                  preventive_measures={pred.preventive_measures}
                  description={pred.description}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Loading Animation CSS */}
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Crop;
