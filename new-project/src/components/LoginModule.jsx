import { FaUser, FaLock } from 'react-icons/fa';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginModule = ({onSwitchToRegister})=>{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleForgotPassword = () => {
        navigate('/forgot-password');
    };

    const handleLoginSubmit = (e) => { 
        e.preventDefault()
    
        axios.post('http://localhost:3001/login', { username, password })
            .then(result => {
                console.log(result)
                if(result.data.status ==='Success'){
                    localStorage.setItem('userId', result.data.user._id); //save local db kay wala cloud
                    navigate('/home')
                }else{
                    alert(result.data.message) // .message kay kung wala Object object ang return sang alert
                }
            })
            .catch(err => console.log(err))
    }

    document.title = 'Login';

    return(  
        <div className="form-box login">
            <form action="" onSubmit={handleLoginSubmit}>
                <h1>Login</h1>
                <>
                    <div className="input-box">
                        <input type="text"
                            name='username'
                            placeholder='Username' required
                            onChange={(e) => {
                                setUsername(e.target.value)
                            }}
                        />
                        <FaUser className='icon' />
                    </div>
                    <div className="input-box">
                        <input type="password"
                            name='password'
                            placeholder='Password' required
                            onChange={(e) => {
                                setPassword(e.target.value)
                            }}
                        />
                        <FaLock className='icon' />
                    </div>
                </>
                <>
                    <div className="remember-me">
                        <a href='' onClick={handleForgotPassword}>Forgot password?</a>
                    </div>
                </>

                <button type="submit">Sign in</button>

                <div className="register-link">
                    <p>Don't have an account?
                        <a onClick={onSwitchToRegister}> Register</a>
                    </p>
                </div>
            </form>
        </div>
    )
}

export default LoginModule