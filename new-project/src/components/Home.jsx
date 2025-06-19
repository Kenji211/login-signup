import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { IoLogOut } from "react-icons/io5";

function Home() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            axios.get(`http://localhost:3001/user/${userId}`)
                .then(res => setUser(res.data))
                .catch(err => console.log(err));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userId');
        navigate('/');
    }

    if (!user) {
        return <h2>Loading...</h2>;
    }

    document.title= 'Home';

    return (
        <div className="homepage">
            <div onClick={handleLogout} className='logout'>
                <a href=''>
                    <IoLogOut className='icon' />
                    LOGOUT
                </a>
            </div>
            <div className="home-wrapper">
                <div className='floating-data'>
                    <div>
                        <h1 className='header'>WELCOME TO THE HOME PAGE!</h1>
                    </div>
                    <div>
                        <p className='details'>Username: {user.username}</p>
                        <p className='details'>Email: {user.email}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;