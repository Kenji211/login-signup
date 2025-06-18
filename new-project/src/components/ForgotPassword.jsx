import { FaEnvelope } from 'react-icons/fa';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:3001/forgot-password', { email });
            setSuccessMessage(response.data.message);
            setEmail('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send password reset email');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const onSwitchToLogin = () => {
        navigate('/');
    };

    return (
        <div className="form-box forgot-password">
            <form onSubmit={handleForgotPasswordSubmit}>
                <h1>Reset Password</h1>
                <div className="input-box">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <FaEnvelope className="icon" />
                </div>

                {error && (
                    <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>
                )}

                {successMessage && (
                    <p style={{ color: 'green', fontSize: '0.9rem' }}>{successMessage}</p>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>

                <div className="register-link">
                    <p>
                       <a href='' onClick={onSwitchToLogin}>Back to Login</a>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword;