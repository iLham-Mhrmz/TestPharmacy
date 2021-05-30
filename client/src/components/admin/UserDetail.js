import React, {useContext, useEffect} from 'react'
import {GlobalState} from '../../GlobalState'
import {Link} from 'react-router-dom'
import axios from 'axios'

function UserDetail() {
    const state = useContext(GlobalState)
    const [users] = state.userAPI.users
    

    console.log(users)

    return (
        <div className="history-page">
            <h2>List Users</h2>

            <h4>You have {users.length} users</h4>

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Register Date</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.map(items => (
                            <tr key={items._id}>
                                <td>{items.name}</td>
                                <td>{items.email}</td>
                                <td>{new Date(items.createdAt).toLocaleDateString()}</td>
                                {/* <td><Link to={`/history/${items._id}`}>View</Link></td> */}
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default UserDetail
