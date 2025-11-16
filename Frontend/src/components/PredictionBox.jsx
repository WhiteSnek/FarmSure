const PredictionBox = ({
  file_name,
  image_base64,
  predicted_crop,
  crop_confidence,
  predicted_disease,
  disease_confidence,
  preventive_measures,
  predicted_severity,
  recommended_pesticides,
}) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "24px",
        alignItems: "flex-start",
        flexWrap: "wrap",
        padding: '24px',
      }}
    >
      {/* Image Section */}
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 2px 10px rgba(0,0,0,0.7)",
            marginBottom: "12px",
          }}
        >
          <img
            src={`data:image/jpeg;base64,${image_base64}`}
            alt={file_name}
            style={{
              width: "120px",
              height: "120px",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>

        <div
          style={{
            fontSize: "12px",
            textAlign: "center",
            fontWeight: "500",
            maxWidth: "120px",
            color: "#b3b3b3",
          }}
        >
          {file_name}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: "300px" }}>
        <div
          style={{
            marginBottom: "20px",
            paddingBottom: "16px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Crop */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
              marginBottom: "10px",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: "18px",
                fontWeight: "700",
                color: "#00ffbf",
                textTransform: "capitalize",
              }}
            >
              Crop: {predicted_crop || "Unknown"}
            </h3>

            {crop_confidence !== undefined && (
              <div
                style={{
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: "600",
                  background:
                    crop_confidence >= 80
                      ? "rgba(0,255,170,0.18)"
                      : crop_confidence >= 60
                      ? "rgba(255,200,0,0.18)"
                      : "rgba(255,0,0,0.18)",
                  color:
                    crop_confidence >= 80
                      ? "#00ffbf"
                      : crop_confidence >= 60
                      ? "#ffdd66"
                      : "#ff6b6b",
                }}
              >
                {crop_confidence}% Confidence
              </div>
            )}
          </div>

          {/* Disease */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: "18px",
                fontWeight: "700",
                color: "#fff",
                textTransform: "capitalize",
              }}
            >
              Disease: {predicted_disease || "None Detected"}
            </h3>

            {disease_confidence !== undefined && (
              <div
                style={{
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: "600",
                  background:
                    disease_confidence >= 80
                      ? "rgba(0,255,170,0.18)"
                      : disease_confidence >= 60
                      ? "rgba(255,200,0,0.18)"
                      : "rgba(255,0,0,0.18)",
                  color:
                    disease_confidence >= 80
                      ? "#00ffbf"
                      : disease_confidence >= 60
                      ? "#ffdd66"
                      : "#ff6b6b",
                }}
              >
                {disease_confidence}% Confidence
              </div>
            )}
          </div>
        </div>

        {/* Severity */}
        {predicted_severity && (
          <div style={{ marginBottom: "20px" }}>
            <h4
              style={{
                margin: "0 0 8px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#b3b3b3",
                textTransform: "uppercase",
              }}
            >
              Predicted Severity
            </h4>

            <div
              style={{
                display: "inline-block",
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: "600",
                background:
                  predicted_severity === "mild"
                    ? "rgba(0,255,170,0.18)"
                    : predicted_severity === "moderate"
                    ? "rgba(255,200,0,0.18)"
                    : "rgba(255,0,0,0.18)",
                color:
                  predicted_severity === "mild"
                    ? "#00ffbf"
                    : predicted_severity === "moderate"
                    ? "#ffdd66"
                    : "#ff6b6b",
              }}
            >
              {predicted_severity}
            </div>
          </div>
        )}

        {/* Preventive Measures */}
        {preventive_measures?.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <h4
              style={{
                margin: "0 0 12px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#b3b3b3",
                textTransform: "uppercase",
              }}
            >
              Preventive Measures
            </h4>

            <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
              {preventive_measures.map((m, idx) => (
                <li
                  key={idx}
                  style={{
                    position: "relative",
                    paddingLeft: "24px",
                    marginBottom: "8px",
                    fontSize: "14px",
                    lineHeight: "1.5",
                    color: "#cccccc",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: "0",
                      top: "6px",
                      width: "6px",
                      height: "6px",
                      backgroundColor: "#3b82f6",
                      borderRadius: "50%",
                    }}
                  ></span>
                  {m}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Pesticides */}
        {recommended_pesticides?.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <h4
              style={{
                margin: "0 0 12px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#b3b3b3",
                textTransform: "uppercase",
              }}
            >
              Recommended Pesticides
            </h4>

            <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
              {recommended_pesticides.map((p, idx) => (
                <li
                  key={idx}
                  style={{
                    position: "relative",
                    paddingLeft: "24px",
                    marginBottom: "8px",
                    fontSize: "14px",
                    lineHeight: "1.5",
                    color: "#cccccc",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: "0",
                      top: "6px",
                      width: "6px",
                      height: "6px",
                      backgroundColor: "#00ffbf",
                      borderRadius: "50%",
                    }}
                  ></span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionBox;
