import Layout from "@/components/Layout";
import { Store } from "@/utils/Store";
import Image from "next/image";
import Link from "next/link";
import {XCircleIcon} from "@heroicons/react/outline";
import React, { useContext, useReducer } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import axios from "axios";
import { toast } from "react-toastify";

function CartScreen(){

    const {state, dispatch} = useContext(Store)
    const {cart: {cartItems}} = state;
    const router = useRouter()

    const removeItemHanlder = (item) => {
        dispatch({type: 'CART_REMOVE_ITEM', payload: item})
    }

    const updateCartHandler = async(item, qty) => {
        const quantity = Number(qty)
        const { data } = await axios.get(`/api/products/${item._id}`);
        if(data.countInStock < quantity){
            return toast.error('Sorry. Product is out of Stock')
        }
        dispatch({type: 'CART_ADD_ITEM', payload:{...item, quantity}})
        toast.success('Product updated in the cart')
    }

    return(
        <Layout title="Shopping Cart">
            <h1 className="mb-4 text-x1" >Shopping Cart</h1>
            {
                cartItems.length === 0 ?
                (<div>
                    Cart is Empty. <Link href="/">Go Shopping</Link>
                </div>):
                (
                    <div className="grid md:grid-cols-4 md:gap-5">
                        <div className="overflow-x-auto md:col-span-3">
                            <table className="min-w-full">
                                <thead className="border-b">
                                    <tr>
                                        <th className="px-5 text-left">Item</th>
                                        <th className="p-5 text-right">Quantity</th>
                                        <th className="p-5 text-right">Price</th>
                                        <th className="p-5">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map((item)=>(
                                        <tr key={item.slug} className="border-b">
                                        <td>
                                            <Link href={`/product/${item.slug}`}>
                                                <p className="flex items-center">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        width={50}
                                                        height={50}
                                                    >
                                                    </Image>
                                                    &nbsp;
                                                    {item.name}
                                                </p>
                                            </Link>
                                        </td>
                                        <td className="p-5 text-right">
                                            <select value={item.quantity} onChange={(e) => updateCartHandler(item, e.target.value)}>
                                            {
                                                [...Array(item.countInStock).keys()].map(x => (
                                                    <option key={x+1} value={x+1}>{x+1}</option>
                                                ))
                                            }
                                            </select>
                                        </td>
                                        <td className="p-5 text-right">{item.price}</td>
                                        <td className="p-5 text-center">
                                            <button onClick={()=> removeItemHanlder(item)}>
                                                <XCircleIcon className="h-5 w-5"></XCircleIcon>
                                            </button>
                                        </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div>
                        <div className="card p-5 ">
                            <ul>
                                <li>
                                    <div className="pb-3 text-xl">Subtotal ({cartItems.reduce((a,c)=>a+c.quantity, 0)}): ${cartItems.reduce((a,c)=> a+c.quantity * c.price, 0)}</div>
                                </li>
                                <li>
                                    <button onClick={()=> router.push('login?redirect=/shipping')} className="primary-button w-full">
                                        Check Out
                                    </button>
                                </li>
                            </ul>
                        </div>
                        </div>
                    </div>
                )
            }
        </Layout>    
    )
}

export default dynamic(()=> Promise.resolve(CartScreen), {ssr: true})