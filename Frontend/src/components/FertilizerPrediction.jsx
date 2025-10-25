import React from 'react';

const FertilizerPrediction = ({ fertilizer }) => {
  return (
    <div style={{
      width: '96%',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      border: '1px solid #e5e7eb',
      padding: '40px 24px',
      marginBottom: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      overflow: 'hidden',
      position: 'relative'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
    }}>
      
      {/* Decorative Background Pattern */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '-30px',
        left: '-30px',
        width: '150px',
        height: '150px',
        background: 'radial-gradient(circle, rgba(34, 197, 94, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }}></div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '20px',
        position: 'relative',
        zIndex: 1
      }}>
        
        {/* Icon with gradient background */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
          borderRadius: '50%',
          marginBottom: '20px',
          boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)',
          position: 'relative'
        }}>
          <span style={{
            fontSize: '40px'
          }}>🌱</span>
          
          {/* Pulse animation ring */}
          <div style={{
            position: 'absolute',
            inset: '-8px',
            borderRadius: '50%',
            border: '2px solid #22c55e',
            opacity: 0.3,
            animation: 'pulse 2s ease-in-out infinite'
          }}></div>
        </div>

        {/* Title with decorative line */}
        <div style={{
          marginBottom: '16px'
        }}>
          <div style={{
            display: 'inline-block',
            padding: '6px 16px',
            backgroundColor: '#f0fdf4',
            borderRadius: '20px',
            border: '1px solid #bbf7d0'
          }}>
            <h4 style={{
              margin: 0,
              fontSize: '13px',
              fontWeight: '600',
              color: '#166534',
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}>
              ✓ Recommended Fertilizer
            </h4>
          </div>
        </div>

        {/* Fertilizer Name with enhanced styling */}
        <div style={{
          backgroundColor: '#dcfce7',
          padding: '20px 40px',
          borderRadius: '12px',
          marginBottom: '16px',
          border: '2px solid #86efac',
          minWidth: '280px'
        }}>
          <h1 style={{
            margin: 0,
            fontSize: '36px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textTransform: 'capitalize',
            letterSpacing: '-0.02em'
          }}>
            {fertilizer}
          </h1>
        </div>

        {/* Subtitle */}
        <p style={{
          margin: 0,
          fontSize: '15px',
          color: '#6b7280',
          lineHeight: '1.5',
          maxWidth: '500px'
        }}>
          Apply this fertilizer to optimize your crop growth and maximize yield based on current soil conditions.
        </p>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.1;
          }
        }
      `}</style>
    </div>
  );
};

export default FertilizerPrediction;