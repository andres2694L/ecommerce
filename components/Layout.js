
import { Store } from '@/utils/Store';
import { Menu } from '@headlessui/react';
import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DropdownLink from './DropdownLink';
import Cookies from 'js-cookie';

export default function Layout({title, children}){

    const {status, data: session} = useSession()
    const {state, dispatch} = useContext(Store)
    const {cart} = state;
    const [cartItemsCount, setcartItemsCount] = useState(0)

    useEffect(()=>{
        setcartItemsCount(cart.cartItems.reduce((a, c)=>a+c.quantity, 0))
    },[cart.cartItems])


    const logoutClickHandler = () =>{
        Cookies.remove('cart');
        dispatch({type: 'CART_RESET'});
        signOut({callbackUrl: '/login'})
    }

    return (
        <>
        <Head>
            <title>{title? title + '- Amazon': 'Amazon'}</title>
            <meta name='description' content='Ecommerce Website' /> 
        </Head>
        <ToastContainer position='bottom-center' limit={1} />
        <div className='flex min-h-screen flex-col justify-between '>
            <header>
                <nav className='flex h-12 items-center px-4 justify-between shadow-md'>
                    <Link href="/" className='text-lg font-bold'>
                        Copyzon
                    </Link>
                    <div className='flex items-center z-10'>
                        <Link href="/Cart" className='p-2'>Cart {cartItemsCount > 0 && (
                            <span className='ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white'>
                                {cartItemsCount}
                            </span>
                        )}
                        </Link>
                        {status === 'loading' ? (
                            'Loading'
                        ): session?.user ? (
                            <Menu as="div" className="relative inline-block"> 
                                <Menu.Button className="text-blue-600">
                                    {session.user.name}
                                </Menu.Button>
                                <Menu.Items className="absolute right-0 w-56 bg-white origin-top-right shadow-lg">
                                    <Menu.Item>
                                        <DropdownLink className="dropdown-link" href="/profile">
                                                Profile
                                        </DropdownLink>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <DropdownLink className="dropdown-link" href="/order-history">
                                                Order History
                                        </DropdownLink>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <DropdownLink className="dropdown-link" href="#">
                                            <p onClick={logoutClickHandler}>Log Out</p>
                                        </DropdownLink>
                                    </Menu.Item>
                                </Menu.Items>
                            </Menu>
                        ): (
                            <Link href="/login">
                                <p className='p-2'> Login</p>
                            </Link>
                        )}
                    </div>
                </nav>
            </header>
            <main className='container m-auto mt-4 px-4'>{children}</main>
            <footer className='flex h-10 justify-center items-center shadow-inner'>Copyright © 2023 Andres Lara</footer>           
        </div>
        </>
    );
};