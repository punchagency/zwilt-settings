import React, { useState } from 'react'

const UsersArray: React.FC = () => {

    const [users, setUsers] = useState<any>([
        {
            email: "jamescharles@zwilt.com",
            img: "",
            connected: true,
            checked: false,
        },
        {
            email: "sheryarasif@zwilt.com",
            img: "",
            connected: true,
            checked: false,
        },
        {
            email: "khalidabdulhafeez@zwilt.com",
            img: "",
            connected: false,
            checked: false,
        },
    ])
    


  return (
    [users, setUsers]
  )
}

export default UsersArray