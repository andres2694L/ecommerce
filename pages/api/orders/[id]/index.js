import db from "@/utils/db"
import { getSession } from "next-auth/react"
import Order from "@/models/Order"
import { getToken } from "next-auth/jwt"

const handler = async(req, res) => {
    const session = await getToken({req})
    if(!session){
        return res.status(401).send('signin required')
    }

    await db.connect()
    const order = await Order.findById(req.query.id)
    await db.disconnect()
    res.send(order)
}

export default handler;