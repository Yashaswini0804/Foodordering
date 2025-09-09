import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Loader from '../components/Loader';
import Error from '../components/Error';

function Paymentadmin() {
  const [payments, setpayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchpayments = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/payments/getallpayments');
        setpayments(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        setError(error);
      }
    };

    fetchpayments();
  }, []);
  return (
    <div className='row'>
      <div className='col-md-11'>
        <h1>Payments</h1>
        <table className='table table-bordered table-dark'>
          <thead className='bs '>
            <tr>
              <th>BookingId</th>
              <th>UserId</th>
              <th>Amount</th>
              <th>Payment Type</th>
              <th>Card Number</th>
              <th>Phone Number</th>
              <th>Status</th>

            </tr>
          </thead>
          <tbody>
            {payments && payments.map(payment => (
              <tr key={payment._id}> 
                <td>{payment._id}</td>
                <td>{payment.userid}</td>
                <td>{payment.amount}</td>
                <td>{payment.paymentType}</td>
                <td>{payment.cardNumber}</td>
                <td>{payment.phoneNumber}</td>
                <td>{payment.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <Loader />}

      </div>
    </div>

  )
}

export default Paymentadmin
