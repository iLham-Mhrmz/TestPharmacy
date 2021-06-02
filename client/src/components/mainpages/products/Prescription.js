import React, {useState, useContext, useEffect} from 'react'
import axios from 'axios'
import {GlobalState} from '../../../GlobalState'
import Loading from '../utils/loading/Loading'
import {Link} from 'react-router-dom'



function Prescription() {
    const state = useContext(GlobalState)
    const [images, setImages] = useState(false)
    const [loading, setLoading] = useState(false)
    const [phoneNumber, setPhoneNUmber] = useState()
    const [isLogged] = state.userAPI.isLogged
    const [token] = state.token


    const handleUpload = async e =>{
        e.preventDefault()
        try {
            if(!isLogged) return alert("You're not logged in")
            const file = e.target.files[0]
            
            if(!file) return alert("File not exist.")

            if(file.size > 1024 * 1024) // 1mb
                return alert("Size too large!")

            if(file.type !== 'image/jpeg' && file.type !== 'image/png') // 1mb
                return alert("File format is incorrect.")

            let formData = new FormData()
            formData.append('file', file)

            setLoading(true)
            const res = await axios.post('/api/upload/prescription', formData, {
                headers: {'content-type': 'multipart/form-data', Authorization: token}
            })
            setLoading(false)
            setImages(res.data)

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const handleDestroy = async () => {
        try {
            if(!isLogged) return alert("You're not logged in")
            setLoading(true)
            await axios.post('/api/destroy', {public_id: images.public_id}, {
                headers: {Authorization: token}
            })
            setLoading(false)
            setImages(false)
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const handleChangeInput = e =>{
        const {value} = e.target
        setPhoneNUmber(value)
    }
    console.log(images)
    console.log(phoneNumber)
    const handleSubmit = async e =>{
        e.preventDefault()
        try {
            if(!isLogged) return alert("You're not logged in")
            if(!images) return alert("No Image Upload")
            await axios.post('/user/prescription', { phoneNumber, images: images}, {
                headers: {Authorization: token}
            }).then(res => {
                alert(res.data.msg)
                window.location.href = '/'
            })
        } catch (err) {
            alert(err.response.data.msg)
        }
    }


    const styleUpload = {
        display: images ? "block" : "none"
    }
    return (
        <div className="create_product">
            <div className="upload">
                <input type="file" name="file" id="file_up" onChange={handleUpload}/>
                {
                    loading ? <div id="file_img"><Loading /></div>

                    :<div id="file_img" style={styleUpload}>
                        <img src={images ? images.url : ''} alt=""/>
                        <span onClick={handleDestroy}>X</span>
                    </div>
                }
                
            </div>

            <form onSubmit={handleSubmit}>
                <div className="row">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input type="number" name="phoneNumber" id="phoneNumber" required 
                    placeholder="Input your phone number" onChange={handleChangeInput} />
                </div>

                <button type="submit">Upload</button>
            </form>
        </div>
    )
}

export default Prescription
