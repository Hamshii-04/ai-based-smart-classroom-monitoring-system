import React, {
  useRef,
  useState,
} from "react";

import Webcam from "react-webcam";

import { toast } from "react-toastify";

import { motion } from "framer-motion";

import {
  FaCamera,
  FaUserPlus,
  FaCheckCircle,
} from "react-icons/fa";

import { registerFace }
from "../services/api";

function Register() {

  const webcamRef = useRef(null);

  const [name, setName] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const capture = async () => {

    if (!name) {

      toast.error(
        "Please enter student name ❌"
      );

      return;
    }

    const image =
      webcamRef.current
        ?.getScreenshot();

    if (!image) return;

    setLoading(true);

    try {

      const res =
        await registerFace(
          name,
          image
        );

      const data =
        await res.json();

      console.log(data);

      setStatus(data.message);

      if (
        data.status === "success"
      ) {

        toast.success(

          `${name} registered successfully ✅`

        );

      } else {

        toast.error(
          "Registration Failed ❌"
        );

      }

    } catch (err) {

      console.log(err);

      toast.error(
        "Server Error ❌"
      );

    }

    setLoading(false);

  };

  return (

    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      style={{
        color: "white",
      }}
    >

      {/* TITLE */}

      <h1
        className="neon-text"
        style={{
          fontSize: 45,
          marginBottom: 35,
        }}
      >
        AI Face Registration
      </h1>

      <div
        style={{
          display: "flex",
          gap: 30,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >

        {/* CAMERA CARD */}

        <motion.div
          whileHover={{
            scale: 1.02,
          }}
          className="glass glow"
          style={{
            padding: 25,
            borderRadius: 30,
          }}
        >

          {/* NAME INPUT */}

          <div
            style={{
              marginBottom: 25,
            }}
          >

            <input

              type="text"

              placeholder=
                "Enter Student Name"

              value={name}

              onChange={(e) =>
                setName(
                  e.target.value
                )
              }

              style={{

                width: "100%",

                padding: 18,

                borderRadius: 18,

                border:
                  "1px solid rgba(255,255,255,0.1)",

                background:
                  "rgba(255,255,255,0.08)",

                color: "white",

                fontSize: 16,

                outline: "none",

              }}
            />

          </div>

          {/* WEBCAM */}

          <Webcam

            ref={webcamRef}

            screenshotFormat=
              "image/jpeg"

            mirrored={true}

            width={600}

            videoConstraints={{

              width: 640,

              height: 480,

              facingMode: "user",

            }}

            style={{
              borderRadius: 25,
            }}
          />

          {/* BUTTON */}

          <motion.button

            whileHover={{
              scale: 1.05,
            }}

            whileTap={{
              scale: 0.95,
            }}

            onClick={capture}

            disabled={loading}

            style={{

              marginTop: 25,

              width: "100%",

              padding: 18,

              border: "none",

              borderRadius: 18,

              fontSize: 18,

              fontWeight: 700,

              cursor: "pointer",

              color: "white",

              background:
                "linear-gradient(90deg,#2563eb,#7c3aed)",

              boxShadow:
                "0 0 20px rgba(99,102,241,0.5)",

            }}
          >

            {loading ? (
              "Registering..."
            ) : (
              <>
                <FaCamera />
                {" "}
                Capture Face
              </>
            )}

          </motion.button>

        </motion.div>

        {/* STATUS CARD */}

        <motion.div
          whileHover={{
            scale: 1.02,
          }}
          className="glass glow"
          style={{

            width: 350,

            padding: 30,

            borderRadius: 30,

          }}
        >

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 15,
            }}
          >

            <FaUserPlus
              size={30}
              color="#38bdf8"
            />

            <h2>
              Registration Status
            </h2>

          </div>

          <motion.div

            animate={{
              scale: [1,1.03,1],
            }}

            transition={{
              repeat: Infinity,
              duration: 2,
            }}

            style={{

              marginTop: 30,

              background:
                "rgba(255,255,255,0.08)",

              padding: 25,

              borderRadius: 20,

              textAlign: "center",

              fontSize: 22,

              fontWeight: 700,

              color:
                status.includes(
                  "success"
                )
                  ? "#22c55e"
                  : "#f59e0b",

            }}
          >

            {status || "Waiting..."}

          </motion.div>

          <br />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >

            <FaCheckCircle
              color="#22c55e"
            />

            <h3>
              MongoDB Sync Enabled
            </h3>

          </div>

        </motion.div>

      </div>

    </motion.div>
  );
}

export default Register;