import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (token) {
      // Save token to localStorage
      localStorage.setItem('token', token);
      alert('GitHub login successful!');
      navigate('/add');
    } else if (error) {
      alert('GitHub authentication failed');
      navigate('/login');
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <div className="text-center mt-10">
      <p className="text-lg">Processing authentication...</p>
    </div>
  );
}

export default AuthCallback;
