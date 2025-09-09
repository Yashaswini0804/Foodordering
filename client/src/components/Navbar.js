import React from 'react'

function Navbar() {

    function logout(){
 localStorage.removeItem('currentuser');
 window.location.href='/login';
    }

    function admin(){
        const user = JSON.parse(localStorage.getItem('currentuser'));
        if(JSON.parse(localStorage.getItem('currentuser')).isAdmin){
            window.location.href="/admin";
        }
        if(! JSON.parse(localStorage.getItem('currentuser')).isAdmin){
            window.location.href="/home";
        }
    }
    const user = JSON.parse(localStorage.getItem('currentuser'));
    
    return (
        <div>
            <nav className="navbar navbar-expand-lg ">
            {user ? (
                    <a className="navbar-brand" href="/home">Ruchira</a>
                ) : (
                    <span className="navbar-brand" style={{ cursor: 'not-allowed', color: 'gray' }}>Ruchira</span>
                )}
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" ><i className="fa-solid fa-bars"style={{color:'White'}}></i></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mr-3">
                        {user ? (<><div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">
                                <i className='fa fa-user'></i>{user.name}
                            </button>
                            <div className="dropdown-menu">
                                <a className="dropdown-item" href="/profile">Profile</a>
                                <a className="dropdown-item" href="/orders">Orders</a>
                                <a className="dropdown-item" href="#" onClick={logout}>Logout</a>
                                <a className='dropdown-item' href='/admin' onClick={admin}>Admin</a>
                            </div>
                        </div>
                        </>) : (<>
                            <li className="nav-item active">
                                <a className="nav-link" href="/register">Register</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/login">Login</a>
                            </li>
                        </>)}

                    </ul>
                </div>
            </nav>
        </div>
    )
}


export default Navbar
