import React, { useState } from "react";

import { motion } from "framer-motion";

import { login } from "../services/api";

function Login({ setLoggedIn }) {

  const [user, setUser] = useState("");

  const [pass, setPass] = useState("");

  const handleLogin = async () => {

    try {

      const res = await login(user, pass);

      if (res.ok) {

        setLoggedIn(true);

      } else {

        alert("Invalid login");

      }

    } catch (err) {

      console.log(err);

      alert("Server Error");

    }
  };

  return (

    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "#1e293b",
        padding: 40,
        borderRadius: 20,
        width: 350,
        margin: "100px auto",
        color: "white",
      }}
    >

      <h1 style={{ marginBottom: 20 }}>
        Admin Login
      </h1>

      <input
        placeholder="Username"
        onChange={(e) =>
          setUser(e.target.value)
        }
        style={inputStyle}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setPass(e.target.value)
        }
        style={inputStyle}
      />

      <button
        onClick={handleLogin}
        style={buttonStyle}
      >
        Login
      </button>

    </motion.div>
  );
}

const inputStyle = {

  width: "100%",

  padding: 12,

  marginBottom: 15,

  borderRadius: 10,

  border: "none",

};

const buttonStyle = {

  width: "100%",

  padding: 12,

  background: "#2563eb",

  color: "white",

  border: "none",

  borderRadius: 10,

  cursor: "pointer",

};

export default Login;