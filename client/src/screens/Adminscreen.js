import React, { useEffect } from 'react';
import { Tabs } from 'antd';
import { Orders } from '../components/adminorder';
import { FoodItems, AddFoodItem } from '../components/adminfood';
import { Restaurants, AddRestaurant } from '../components/adminrestaurant';
import { Users, Paymentadmin } from '../components/adminpayment';

function Adminscreen() {
    useEffect(() => {
        if (!JSON.parse(localStorage.getItem('currentuser')).isAdmin) {
            window.location.href = "/home";
        }
    })

    return (
        <div className='md-3 mt-3 mr-3 bs'>
            <h2 className='text-center' style={{ fontSize: '20px' }}><b>Admin Panel</b></h2>
            <Tabs
                defaultActiveKey="1"
                items={[
                    {
                        label: 'Orders',
                        key: '1',
                        children: (
                            <Orders />
                        ),
                    },
                    {
                        label: 'Food Items',
                        key: '2',
                        children: (
                            <FoodItems />
                        ),
                    },
                    {
                        label: 'Add Food Item',
                        key: '3',
                        children: (
                            <AddFoodItem />
                        ),
                    },
                    {
                        label: 'Restaurants',
                        key: '4',
                        children: (
                            <Restaurants />
                        ),
                    },
                    {
                        label: 'Add Restaurant',
                        key: '5',
                        children: (
                            <AddRestaurant />
                        ),
                    },
                    {
                        label: 'Users',
                        key: '6',
                        children: (
                            <Users />
                        ),
                    },
                    {
                        label: 'Payments',
                        key: '7',
                        children: (
                            <Paymentadmin />
                        ),
                    },
                ]}
            />
        </div>
    )

}

export default Adminscreen

