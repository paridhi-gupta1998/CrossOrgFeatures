import React from 'react';
import Home from './github';
import { useState } from 'react';

export default function Parent() {

    const [inputField, setInputField] = useState({
        username: '',
        pat: ''
    })

    const [data, setData] = useState({username: '', pat: ''})
    const [visible, setVisilbility] = useState("")
    const inputsHandler = (e) => {
        setInputField({ ...inputField, [e.target.name]: e.target.value })
    }

    const submitButton = () => {
        
        setData({...data, username: inputField.username, pat: inputField.pat})
        setVisilbility("true")
    }

    return (
        <div>
            <input
                type="text"
                name="username"
                onChange={inputsHandler}
                placeholder="Username"
                value={inputField.username} />

            <br />

            <input
                type="password"
                name="pat"
                onChange={inputsHandler}
                placeholder="Personal Access Token"
                value={inputField.pat} />

            <br />


            <button onClick={submitButton}>Submit Now</button>


            {visible === 'true' ? <Home {...data}/> : undefined}
        </div>
    )
}