const UploadedFile = ({ file, onRemove }) => {
  console.log(file);

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file extension
  const getFileExtension = (filename) => {
    return filename.split('.').pop().toUpperCase();
  };

  return (
    <div style={{
      width: '95%',
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '12px',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      transition: 'all 0.2s ease',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = '#f9fafb';
      e.currentTarget.style.borderColor = '#d1d5db';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = '#ffffff';
      e.currentTarget.style.borderColor = '#e5e7eb';
    }}>
      
      {/* Image Thumbnail */}
      <div style={{
        flexShrink: 0,
        position: 'relative'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '6px',
          overflow: 'hidden',
          border: '1px solid #e5e7eb',
          backgroundColor: '#f3f4f6'
        }}>
          <img
            src={`data:image/jpeg;base64,${file.base64Data}`}
            alt={file.name}
            style={{ 
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
          />
        </div>
        
        {/* File Type Badge */}
        <div style={{
          position: 'absolute',
          top: '-6px',
          right: '-6px',
          backgroundColor: '#3b82f6',
          color: 'white',
          fontSize: '8px',
          fontWeight: '600',
          padding: '2px 4px',
          borderRadius: '4px',
          lineHeight: '1'
        }}>
          {getFileExtension(file.name)}
        </div>
      </div>

      {/* File Info */}
      <div style={{
        flex: 1,
        minWidth: 0 // Allow text truncation
      }}>
        <div style={{
          fontSize: '14px',
          fontWeight: '500',
          color: '#1f2937',
          marginBottom: '2px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {file.name}
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '12px',
          color: '#6b7280'
        }}>
          <span>{formatFileSize(file.size)}</span>
          <span style={{
            width: '3px',
            height: '3px',
            backgroundColor: '#d1d5db',
            borderRadius: '50%'
          }}></span>
          <span style={{
            textTransform: 'capitalize'
          }}>
            {file.type.split('/')[1] || 'Image'}
          </span>
        </div>
      </div>

      {/* Status Indicator */}
      <div style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        {/* Success Icon */}
        <div style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: '#dcfce7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg 
            width="12" 
            height="12" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#16a34a" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polyline points="20,6 9,17 4,12"></polyline>
          </svg>
        </div>

        {/* Remove Button (optional) */}
        {onRemove && (
          <button
            onClick={() => onRemove(file)}
            style={{
              width: '20px',
              height: '20px',
              border: 'none',
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fecaca';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fee2e2';
            }}
            title="Remove file"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default UploadedFile;