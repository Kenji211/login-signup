import { useState, useEffect } from 'react';
import './LoginRegister.css';
import LoginModule from './LoginModule';
import RegisterModule from './SignUpModule';

const LoginRegister = () => {

    const [action, setAction] = useState('login');

    useEffect(() => {
        document.title = action === 'login' ? 'Login' : 'Register';
    }, [action]);

    return (
        <div className="login-register-bg">
            <div className={`wrapper ${action}`}>
                <LoginModule onSwitchToRegister={() => setAction('register')} />
                <RegisterModule onSwitchToLogin={() => setAction('login')} />
            </div>
        </div>
    )
}

export default LoginRegister