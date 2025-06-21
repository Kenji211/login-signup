import { useParams } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import './ResetPassword.css';
import { useNavigate } from 'react-router-dom';


const ResetPassword = () => {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const navigate = useNavigate();

    const handleReset = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setStatusMessage('Passwords do not match');
            return;
        }

        try {
            const res = await axios.post('http://localhost:3001/reset-password', {
                token,
                password: newPassword,
            })
            setStatusMessage(res.data.message);
            console.log(res.data.status);
            alert(res.data.message);
            if (res.data.status === 'Success') {
                navigate('/');
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Error resetting password';
            alert(message);
            setStatusMessage(message);
        }
    };

    return (
        <div className='form-box reset-password'>
            <div className='reset-password-wrapper'>
                <h2>Reset Password</h2>
                <form onSubmit={handleReset}>
                    <div className='input-box'>
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className='input-box'>
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    {confirmPassword && confirmPassword !== newPassword && (
                        <p className="confirmPasswordError" style={{ color: 'red', fontSize: '0.9rem' }}>
                            Passwords do not match.
                        </p>
                    )}

                    <button type="submit">Reset Password</button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword