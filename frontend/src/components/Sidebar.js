import React, { useState } from "react";

import { motion } from "framer-motion";

import {
  FaUserPlus,
  FaClipboardCheck,
  FaVideo,
  FaChartBar,
  FaLock,
  FaUserCircle,
  FaBars,
} from "react-icons/fa";

function Sidebar({

  setPage,

  adminLoggedIn,

}) {

  const [collapsed, setCollapsed] =
    useState(false);

  return (

    <motion.div
      initial={{ x: -120 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        width: collapsed ? 90 : 270,
        height: "100vh",
        padding: 20,
        position: "fixed",
        left: 0,
        top: 0,

        background:
          "rgba(15,23,42,0.85)",

        backdropFilter: "blur(15px)",

        borderRight:
          "1px solid rgba(255,255,255,0.08)",

        color: "white",

        transition: "0.3s",

        boxShadow:
          "0 0 30px rgba(0,0,0,0.3)",
      }}
    >

      {/* TOP */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 40,
        }}
      >

        {!collapsed && (

          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,

              background:
                "linear-gradient(90deg,#38bdf8,#8b5cf6,#ec4899)",

              WebkitBackgroundClip:
                "text",

              WebkitTextFillColor:
                "transparent",
            }}
          >
            Smart AI
          </h1>

        )}

        <button
          onClick={() =>
            setCollapsed(!collapsed)
          }
          style={{
            background:
              "rgba(255,255,255,0.08)",

            border: "none",

            color: "white",

            width: 40,

            height: 40,

            borderRadius: 12,

            cursor: "pointer",
          }}
        >

          <FaBars size={18} />

        </button>

      </div>

      {/* ADMIN AVATAR */}

      {adminLoggedIn && (

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            textAlign: "center",
            marginBottom: 35,
          }}
        >

          <FaUserCircle
            size={70}
            color="#60a5fa"
          />

          {!collapsed && (

            <>
              <h3>Administrator</h3>

              <p
                style={{
                  color: "#94a3b8",
                }}
              >
                System Control
              </p>
            </>

          )}

        </motion.div>

      )}

      {/* PUBLIC */}

      <SidebarButton
        icon={<FaClipboardCheck />}
        text="Attendance"
        collapsed={collapsed}
        onClick={() =>
          setPage("attendance")
        }
      />

      <SidebarButton
        icon={<FaUserPlus />}
        text="Register"
        collapsed={collapsed}
        onClick={() =>
          setPage("register")
        }
      />

      {/* LOGIN */}

      {!adminLoggedIn && (

        <SidebarButton
          icon={<FaLock />}
          text="Admin Login"
          collapsed={collapsed}
          onClick={() =>
            setPage("login")
          }
        />

      )}

      {/* ADMIN */}

      {adminLoggedIn && (

        <>

          <SidebarButton
            icon={<FaVideo />}
            text="Live Recognition"
            collapsed={collapsed}
            onClick={() =>
              setPage("live")
            }
          />

          <SidebarButton
            icon={<FaChartBar />}
            text="Dashboard"
            collapsed={collapsed}
            onClick={() =>
              setPage("dashboard")
            }
          />

          <SidebarButton
            icon={<FaLock />}
            text="Logout"
            collapsed={collapsed}
            onClick={() => {

              localStorage.removeItem(
                "admin"
              );

              window.location.reload();

            }}
          />

        </>

      )}

    </motion.div>
  );
}

function SidebarButton({

  icon,

  text,

  onClick,

  collapsed,

}) {

  return (

    <motion.button
      whileHover={{
        scale: 1.05,

        backgroundColor:
          "#2563eb",
      }}

      whileTap={{
        scale: 0.95,
      }}

      onClick={onClick}

      style={{
        width: "100%",

        padding: 16,

        marginBottom: 18,

        border: "none",

        borderRadius: 18,

        background:
          "rgba(255,255,255,0.05)",

        color: "white",

        display: "flex",

        alignItems: "center",

        gap: 14,

        cursor: "pointer",

        fontSize: 16,

        transition: "0.3s",

        backdropFilter: "blur(10px)",
      }}
    >

      {icon}

      {!collapsed && text}

    </motion.button>
  );
}

export default Sidebar;