import { useState, useEffect } from 'react';

export default function SchemesPage() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_GOVERNMENT_SCHEMES_URL}`);
      const result = await res.json();

      if (result.success) {
        setSchemes(result.data);
      }
    } catch (err) {
      console.error("Failed to fetch schemes:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return <SchemesSkeleton />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '40px 20px',
      color: '#ffffff'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '1px'
          }}>
            Government Schemes
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '16px',
            marginTop: '8px'
          }}>
            {schemes.length} schemes available for farmers
          </p>
        </div>

        {/* Schemes Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '24px'
        }}>
          {schemes.map((scheme, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '24px',
                backdropFilter: 'blur(12px)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(34, 197, 94, 0.2)';
                e.currentTarget.style.borderColor = '#22c55e';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              {/* Shine Effect */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '50%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                transition: '0.5s',
                animation: 'shine 3s infinite'
              }}></div>

              {/* Scheme Name */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#ffffff',
                  margin: 0,
                  flex: 1
                }}>
                  {scheme.scheme_name}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(scheme.scheme_name, index);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: copiedId === index ? '#22c55e' : 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                    fontSize: '14px',
                    padding: '4px'
                  }}
                >
                  {copiedId === index ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {/* Short Description */}
              <p style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '14px',
                lineHeight: '1.6',
                margin: '0 0 16px 0'
              }}>
                {scheme.description.length > 120
                  ? scheme.description.substring(0, 120) + '...'
                  : scheme.description}
              </p>

              {/* Expand Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(index);
                }}
                style={{
                  background: 'none',
                  border: '1px solid #22c55e',
                  color: '#22c55e',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#22c55e';
                  e.target.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'none';
                  e.target.style.color = '#22c55e';
                }}
              >
                {expandedId === index ? 'Show Less' : 'View Details'}
              </button>

              {/* Expanded Details */}
              {expandedId === index && (
                <div style={{
                  marginTop: '20px',
                  paddingTop: '20px',
                  borderTop: '1px dashed rgba(255,255,255,0.2)',
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.9)'
                }}>
                  <DetailItem label="Eligibility" value={scheme.eligibility_criteria} />
                  <DetailItem label="Benefits" value={scheme.benefits} />
                  <DetailItem label="Application Process" value={scheme.application_process} />
                  <DetailItem label="Required Documents" value={scheme.required_documents} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Reusable Detail Row
function DetailItem({ label, value }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <strong style={{ color: '#22c55e', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>
        {label}:
      </strong>
      <p style={{ margin: '8px 0 0 0', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
        {value || 'Not specified'}
      </p>
    </div>
  );
}

// Loading Skeleton
function SchemesSkeleton() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ height: '40px', width: '300px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', margin: '0 auto' }}></div>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '24px'
        }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{
              height: '220px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{ height: '20px', width: '70%', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '16px' }}></div>
              <div style={{ height: '60px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '16px' }}></div>
              <div style={{ height: '36px', width: '120px', background: 'rgba(34,197,94,0.2)', borderRadius: '8px' }}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}