import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from './Loader';
import Error from './Error';
import Paymentadmin from './Paymentadmin';

export function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/users/getallusers');
                setUsers(response.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
                setError(error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className='row'>
            <div className='col-md-11'>
                <h1>Users</h1>
                {loading && <Loader />}
                {error && <Error message="Error fetching users" />}
                <table className='table table-bordered table-dark'>
                    <thead className='bs '>
                        <tr>
                            <th>UserId</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Is Admin</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length ? (
                            users.map(user => (
                                <tr key={user._id}>
                                    <td>{user._id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone || 'N/A'}</td>
                                    <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No users available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export { Paymentadmin };
