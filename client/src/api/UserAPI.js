import {useState, useEffect} from 'react'
import axios from 'axios'

function UserAPI(token) {
    const [isLogged, setIsLogged] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [user, setUser] = useState()
    const [users, setUsers] = useState([])
    const [cart, setCart] = useState([])
    const [history, setHistory] = useState([])

    useEffect(() =>{
        if(token){
            const getUser = async () =>{
                try {
                    const res = await axios.get('/user/infor', {
                        headers: {Authorization: token}
                    })

                    setIsLogged(true)
                    res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false)

                    setCart(res.data.cart)

                    setUser(res.data)

                } catch (err) {
                    alert(err.response.data.msg)
                }
            }

            getUser()
        }

        if(token){
            const getUsersAllInfor = async () =>{
                try {
                    const res = await axios.get('/user/all', {
                        headers: {Authorization: token}
                    })
                    setUsers(res.data)

                } catch (err) {
                    alert(err.response.data.msg)
                }
            }

            getUsersAllInfor()
        }
    },[token])

    

    const addCart = async (product) => {
        if(!isLogged) return alert("Please login to continue buying")

        const check = cart.every(item =>{
            return item._id !== product._id
        })

        if(check){
            setCart([...cart, {...product, quantity: 1}])

            await axios.patch('/user/addcart', {cart: [...cart, {...product, quantity: 1}]}, {
                headers: {Authorization: token}
            })

        }else{
            alert("This product has been added to cart.")
        }
    }

    return {
        isLogged: [isLogged, setIsLogged],
        isAdmin: [isAdmin, setIsAdmin],
        cart: [cart, setCart],
        user: [user, setUser],
        users: [users, setUsers],
        addCart: addCart,
        history: [history, setHistory]
    }
}

export default UserAPI
 