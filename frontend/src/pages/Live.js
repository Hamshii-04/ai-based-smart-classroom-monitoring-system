import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import Webcam from "react-webcam";

import { motion } from "framer-motion";

import {
  FaUser,
  FaBrain,
  FaMobileAlt,
  FaCheckCircle,
} from "react-icons/fa";

function Live() {

  const webcamRef = useRef(null);

  const [students, setStudents] =
    useState([]);

  const [attention, setAttention] =
    useState("Checking...");

  const [phone, setPhone] =
    useState("No Phone");

  useEffect(() => {

    const interval = setInterval(
      async () => {

        if (!webcamRef.current)
          return;

        const imageSrc =
          webcamRef.current.getScreenshot();

        if (!imageSrc)
          return;

        try {

          const res = await fetch(
            "http://127.0.0.1:8000/recognize",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                image: imageSrc,
              }),
            }
          );

          const data =
            await res.json();

          console.log(data);

          setStudents(
            data.students || []
          );

          setAttention(
            data.attention ||
            "Attentive"
          );

          setPhone(
            data.phone ||
            "No Phone"
          );

        } catch (err) {

          console.log(err);

        }

      },

      2500
    );

    return () =>
      clearInterval(interval);

  }, []);

  return (

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        color: "white",
      }}
    >

      {/* TITLE */}

      <h1
        className="neon-text"
        style={{
          marginBottom: 35,
          fontSize: 45,
          fontWeight: 800,
        }}
      >
        AI Multi Face Tracking
      </h1>

      {/* CAMERA */}

      <motion.div
        whileHover={{
          scale: 1.01,
        }}
        className="glass glow"
        style={{
          padding: 20,
          borderRadius: 30,
          marginBottom: 35,
        }}
      >

        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          mirrored={true}
          width={900}
          videoConstraints={{
            width: 640,
            height: 480,
            facingMode: "user"
          }}
          style={{
            borderRadius: 25,
          }}
        />

      </motion.div>

      {/* AI STATUS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(260px,1fr))",
          gap: 20,
          marginBottom: 35,
        }}
      >

        {/* ATTENTION */}

        <StatusCard
          title="Attention"
          value={attention}
          icon={<FaBrain />}
          color={
            attention === "Sleepy"
              ? "#ef4444"
              : "#22c55e"
          }
        />

        {/* PHONE */}

        <StatusCard
          title="Phone Detection"
          value={phone}
          icon={<FaMobileAlt />}
          color={
            phone === "Using Phone"
              ? "#ef4444"
              : "#22c55e"
          }
        />

      </div>

      {/* MULTIPLE STUDENTS */}

      <h1
        className="neon-text"
        style={{
          marginBottom: 25,
          fontSize: 35,
        }}
      >
        Live Student Tracking
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(280px,1fr))",
          gap: 20,
        }}
      >

        {students.map((student, index) => {

          let scoreColor = "#ef4444";

          if (student.score > 90) {

            scoreColor = "#22c55e";

          }

          else if (
            student.score > 75
          ) {

            scoreColor = "#f59e0b";

          }

          return (

            <motion.div
              key={index}
              whileHover={{
                scale: 1.03,
              }}
              className="glass glow"
              style={{

                padding: 25,

                borderRadius: 25,

              }}
            >

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >

                <FaUser
                  color="#38bdf8"
                  size={25}
                />

                <h2>
                  {student.name}
                </h2>

              </div>

              {/* SCORE */}

              <motion.h1

                animate={{
                  scale: [1,1.03,1],
                }}

                transition={{
                  repeat: Infinity,
                  duration: 2,
                }}

                style={{

                  marginTop: 20,

                  color: scoreColor,

                  fontSize: 42,

                  fontWeight: 800,

                  textShadow:
                    `0 0 15px ${scoreColor}`,

                }}
              >

                {student.score}%

              </motion.h1>

              {/* AI BAR */}

              <div
                style={{
                  marginTop: 20,
                }}
              >

                <div
                  style={{
                    width: "100%",
                    height: 16,
                    background:
                      "rgba(255,255,255,0.08)",
                    borderRadius: 20,
                    overflow: "hidden",
                  }}
                >

                  <motion.div

                    initial={{
                      width: 0,
                    }}

                    animate={{
                      width:
                        `${student.score}%`,
                    }}

                    transition={{
                      duration: 0.8,
                    }}

                    style={{
                      height: "100%",
                      background:
                        scoreColor,
                      borderRadius: 20,
                    }}
                  />

                </div>

              </div>

              {/* STATUS */}

              <div
                style={{
                  marginTop: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >

                <FaCheckCircle
                  color={scoreColor}
                />

                <p>
                  AI Tracking Active
                </p>

              </div>

            </motion.div>

          );

        })}

      </div>

    </motion.div>
  );
}

/* STATUS CARD */

function StatusCard({

  title,
  value,
  icon,
  color,

}) {

  return (

    <motion.div
      whileHover={{
        scale: 1.03,
      }}
      className="glass glow"
      style={{

        padding: 25,

        borderRadius: 25,

      }}
    >

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >

        <div
          style={{
            color,
            fontSize: 25,
          }}
        >
          {icon}
        </div>

        <h2>{title}</h2>

      </div>

      <h1
        style={{
          marginTop: 20,
          color,
          fontSize: 35,
        }}
      >
        {value}
      </h1>

    </motion.div>

  );
}

export default Live;