const PredictionBox = ({
  file_name,
  image_base64,
  predicted_crop,
  crop_confidence,
  predicted_disease,
  disease_confidence,
  preventive_measures,
  description
}) => {
  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e5e7eb',
        padding: '24px',
        marginBottom: '20px',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '24px',
          alignItems: 'flex-start',
          flexWrap: 'wrap'
        }}
      >
        {/* Image Section */}
        <div
          style={{
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <div
            style={{
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              marginBottom: '12px'
            }}
          >
            <img
              src={`data:image/jpeg;base64,${image_base64}`}
              alt={file_name}
              style={{
                width: '120px',
                height: '120px',
                objectFit: 'cover',
                display: 'block'
              }}
            />
          </div>
          <div
            style={{
              fontSize: '12px',
              color: '#6b7280',
              textAlign: 'center',
              fontWeight: '500',
              maxWidth: '120px',
              wordBreak: 'break-word'
            }}
          >
            {file_name}
          </div>
        </div>

        {/* Content Section */}
        <div
          style={{
            flex: 1,
            minWidth: '300px'
          }}
        >
          {/* Header with Crop & Disease Prediction */}
          <div
            style={{
              marginBottom: '20px',
              paddingBottom: '16px',
              borderBottom: '1px solid #f3f4f6'
            }}
          >
            {/* Crop Name */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '10px'
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#047857',
                  textTransform: 'capitalize'
                }}
              >
                Crop: {predicted_crop || 'Unknown'}
              </h3>

              {crop_confidence !== undefined && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    backgroundColor:
                      crop_confidence >= 80
                        ? '#dcfce7'
                        : crop_confidence >= 60
                        ? '#fef3c7'
                        : '#fee2e2',
                    color:
                      crop_confidence >= 80
                        ? '#166534'
                        : crop_confidence >= 60
                        ? '#92400e'
                        : '#dc2626',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}
                >
                  {crop_confidence}% Confidence
                </div>
              )}
            </div>

            {/* Disease Name */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937',
                  textTransform: 'capitalize'
                }}
              >
                Disease: {predicted_disease || 'None Detected'}
              </h3>

              {disease_confidence !== undefined && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    backgroundColor:
                      disease_confidence >= 80
                        ? '#dcfce7'
                        : disease_confidence >= 60
                        ? '#fef3c7'
                        : '#fee2e2',
                    color:
                      disease_confidence >= 80
                        ? '#166534'
                        : disease_confidence >= 60
                        ? '#92400e'
                        : '#dc2626',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}
                >
                  {disease_confidence}% Confidence
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {description && (
            <div style={{ marginBottom: '20px' }}>
              <h4
                style={{
                  margin: '0 0 8px 0',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                Description
              </h4>
              <p
                style={{
                  margin: 0,
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: '#4b5563'
                }}
              >
                {description}
              </p>
            </div>
          )}

          {/* Preventive Measures */}
          {preventive_measures && preventive_measures.length > 0 && (
            <div>
              <h4
                style={{
                  margin: '0 0 12px 0',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                Preventive Measures
              </h4>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: '0',
                  listStyle: 'none'
                }}
              >
                {preventive_measures.map((measure, idx) => (
                  <li
                    key={idx}
                    style={{
                      position: 'relative',
                      paddingLeft: '24px',
                      marginBottom: '8px',
                      fontSize: '14px',
                      lineHeight: '1.5',
                      color: '#4b5563'
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        left: '0',
                        top: '2px',
                        width: '6px',
                        height: '6px',
                        backgroundColor: '#3b82f6',
                        borderRadius: '50%'
                      }}
                    ></span>
                    {measure}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictionBox;
