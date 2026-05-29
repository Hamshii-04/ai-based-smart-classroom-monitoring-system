import React, { useState } from "react";

import { motion } from "framer-motion";

import Register from "./pages/Register";
import Attendance from "./pages/Attendance";
import Dashboard from "./pages/Dashboard";
import Live from "./pages/Live";
import Login from "./pages/Login";

import Sidebar from "./components/Sidebar";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

  const [page, setPage] = useState("");

  const [adminLoggedIn, setAdminLoggedIn] =
    useState(
      localStorage.getItem("admin") === "true"
    );

  return (

    <div
      style={{
        background:
          "linear-gradient(135deg, #020617, #0f172a)",
        minHeight: "100vh",
        color: "white",
        overflowX: "hidden",
      }}
    >

      {/* SIDEBAR */}

      <Sidebar
        setPage={setPage}
        adminLoggedIn={adminLoggedIn}
      />

      {/* MAIN CONTENT */}

      <div
        style={{
          marginLeft: 290,
          padding: 40,
        }}
      >

        {/* HOME SCREEN */}

        {page === "" && (

          <motion.div
            initial={{
              opacity: 0,
              y: 40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
            }}
            style={{
              marginTop: 100,
              textAlign: "center",
            }}
          >

            <h1
              style={{
                fontSize: 70,
                marginBottom: 20,
                fontWeight: 800,
                background:
                  "linear-gradient(90deg,#38bdf8,#8b5cf6,#ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor:
                  "transparent",
              }}
            >
              Smart Classroom AI
            </h1>

            <p
              style={{
                color: "#94a3b8",
                fontSize: 24,
                marginBottom: 60,
              }}
            >
              AI Powered Attendance &
              Analytics System
            </p>

            {/* FEATURE CARDS */}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 30,
                flexWrap: "wrap",
              }}
            >

              <FeatureCard
                title="Face Recognition"
                text="Real-time AI attendance monitoring"
              />

              <FeatureCard
                title="Analytics Dashboard"
                text="Track student attendance visually"
              />

              <FeatureCard
                title="Smart Registration"
                text="Instant face onboarding system"
              />

            </div>

          </motion.div>

        )}

        {/* PUBLIC PAGES */}

        {page === "attendance" && (
          <Attendance />
        )}

        {page === "register" && (
          <Register />
        )}

        {/* LOGIN */}

        {page === "login" && (

          <Login
            setLoggedIn={setAdminLoggedIn}
          />

        )}

        {/* ADMIN PAGES */}

        {(page === "live" ||
          page === "dashboard") && (

          adminLoggedIn ?

            (
              <>
                {page === "live" &&
                  <Live />
                }

                {page === "dashboard" &&
                  <Dashboard />
                }
              </>
            )

            :

            <Login
              setLoggedIn={
                setAdminLoggedIn
              }
            />

        )}

      </div>

      {/* TOAST */}

      <ToastContainer />
{/* COPYRIGHT */}

{/* COPYRIGHT */}

<motion.div

  initial={{
    opacity: 0,
    y: 30,
  }}

  animate={{
    opacity: 1,
    y: 0,
  }}

  transition={{
    duration: 1,
  }}

  style={{

    textAlign: "center",

    padding: 25,

    marginTop: 60,

    color: "#cbd5e1",

    fontSize: 15,

    borderTop:
      "1px solid rgba(255,255,255,0.1)",

    background:
      "rgba(255,255,255,0.03)",

    backdropFilter: "blur(10px)",

    boxShadow:
      "0 0 25px rgba(99,102,241,0.25)",

    position: "relative",

    overflow: "hidden",

  }}
>

  {/* GLOW ANIMATION */}

  <motion.div

    animate={{
      x: ["-100%", "200%"],
    }}

    transition={{
      repeat: Infinity,
      duration: 4,
      ease: "linear",
    }}

    style={{

      position: "absolute",

      top: 0,

      left: 0,

      width: "40%",

      height: "100%",

      background:
        "linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)",

      transform: "skewX(-20deg)",

    }}
  />

  {/* TYPING TEXT */}

  <motion.h3

    initial={{
      width: 0,
    }}

    animate={{
      width: "100%",
    }}

    transition={{
      duration: 4,
    }}

    style={{

      overflow: "hidden",

      whiteSpace: "nowrap",

      margin: 0,

      color: "#e2e8f0",

      fontWeight: 600,

      letterSpacing: 1,

    }}
  >

    © 2026 Smart Classroom AI System • Developed by Sohil Athar

  </motion.h3>

  <motion.p

    animate={{
      opacity: [0.5,1,0.5],
    }}

    transition={{
      repeat: Infinity,
      duration: 2,
    }}

    style={{

      marginTop: 10,

      color: "#94a3b8",

      fontSize: 13,

    }}
  >

    

  </motion.p>

</motion.div>
    </div>
  );
}

/* FEATURE CARD */

function FeatureCard({

  title,
  text,

}) {

  return (

    <motion.div
      whileHover={{
        scale: 1.05,
        y: -10,
      }}
      transition={{
        duration: 0.3,
      }}
      style={{
        width: 300,
        padding: 35,
        borderRadius: 25,
        background:
          "rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
        border:
          "1px solid rgba(255,255,255,0.1)",
        boxShadow:
          "0 0 30px rgba(0,0,0,0.3)",
      }}
    >

      <h2
        style={{
          marginBottom: 15,
          background:
            "linear-gradient(90deg,#38bdf8,#8b5cf6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor:
            "transparent",
        }}
      >
        {title}
      </h2>

      <p
        style={{
          color: "#cbd5e1",
          lineHeight: 1.6,
        }}
      >
        {text}
      </p>

    </motion.div>
  );
}

export default App;