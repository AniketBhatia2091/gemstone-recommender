import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <p style={{ fontSize: '72px', fontWeight: 500, color: '#c9a84c', lineHeight: 1, marginBottom: '16px' }}>
        404
      </p>
      <h1 className="text-xl font-serif font-semibold mb-2" style={{ color: '#f5f0e8' }}>
        This path is not written in the stars
      </h1>
      <p className="text-sm mb-8 max-w-sm" style={{ color: '#9b8ea0' }}>
        The page you're looking for doesn't exist in this realm.
      </p>
      <button onClick={() => navigate('/')} className="btn-gold" id="notfound-home-btn">
        Return to Home
      </button>
    </div>
  );
}
