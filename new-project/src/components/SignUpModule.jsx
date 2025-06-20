import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import axios from 'axios';

const RegisterModule = ({ onSwitchToLogin }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (successMessage) {
            alert(successMessage);
        }
        if(error){
            alert(error);
        }
    }, [successMessage, error]);

    const handleRegistrationSubmit = async (e) => {
        e.preventDefault()
        setError('');
        setSuccessMessage('');

        setLoading(true);

        try {
            const response = await axios.post('http://localhost:3001/register', { username, email, password });
            setSuccessMessage(response.data.message);
            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            console.error(err);

            
        } finally {
            setLoading(false);
            if(successMessage){
                onSwitchToLogin();
            }
        }
    }

    document.title = 'Register';
    
    return (
        <div className="form-box register" >
            <form onSubmit={handleRegistrationSubmit}>
                <h1>Register</h1>
                <>
                    <div className="input-box">
                        <input type="text"
                            name='username'
                            placeholder='Username' required
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value)
                            }}
                        />
                        <FaUser className='icon' />
                    </div>

                    <div className="input-box">
                        <input type="text"
                            name='email'
                            placeholder='Email' required
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                            }}
                        />
                        <FaEnvelope className='icon' />
                    </div>

                    <div className="input-box">
                        <input type="password"
                            name='password'
                            placeholder='Password' required
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                            }}
                        />
                        <FaLock className='icon' />
                    </div>
                    <div className="input-box">
                        <input type="password"
                            name='confirm-password'
                            placeholder='Confirm password' required
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value)
                            }}
                        />
                        <FaLock className='icon' />
                    </div>
                </>
                {confirmPassword && confirmPassword !== password && (
                    <p className="confirmPasswordError" style={{ color: 'red', fontSize: '0.9rem' }}>
                        Passwords do not match.
                    </p>
                )}

                {error && (
                    <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? 'Signing up...' : 'Sign up'}
                </button>

                <div className="register-link">
                    <p>Already have an account?
                        <a onClick={onSwitchToLogin}> Login</a>
                    </p>
                </div>
            </form>
        </div>
    )
}

export default RegisterModule