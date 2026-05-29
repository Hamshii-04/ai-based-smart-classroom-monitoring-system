import React, {
  useRef,
  useState,
} from "react";

import Webcam from "react-webcam";

import { toast } from "react-toastify";

import { motion } from "framer-motion";

import {
  FaCamera,
  FaCheckCircle,
  FaUserGraduate,
} from "react-icons/fa";

import { recognizeFace }
from "../services/api";

function Attendance() {

  const webcamRef = useRef(null);

  const [name, setName] =
    useState("Waiting...");

  const [loading, setLoading] =
    useState(false);

  const [score, setScore] =
    useState(0);

  // AI SCORE COLORS

  let scoreColor = "#ef4444";

  if (score > 90) {

    scoreColor = "#22c55e";

  }

  else if (score > 75) {

    scoreColor = "#f59e0b";

  }

  const markAttendance =
    async () => {

      const image =
        webcamRef.current
          ?.getScreenshot();

      if (!image) return;

      setLoading(true);

      try {

        const res =
          await recognizeFace(
            image
          );

        const data =
          await res.json();

        console.log(data);

        setName(data.name);

        setScore(
          data.score || 0
        );

        if (
          data.name !==
            "Unknown" &&

          data.name !==
            "Error"
        ) {

          toast.success(

            `Attendance marked for ${data.name} ✅`

          );

        } else {

          toast.error(
            "Face not recognized ❌"
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
          fontWeight: 800,
        }}
      >
        AI Attendance System
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

          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
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

          <motion.button

            whileHover={{
              scale: 1.05,
            }}

            whileTap={{
              scale: 0.95,
            }}

            onClick={
              markAttendance
            }

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
              "Recognizing..."
            ) : (
              <>
                <FaCamera />
                {" "}
                Mark Attendance
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

            <FaUserGraduate
              size={30}
              color="#38bdf8"
            />

            <h2>
              Recognized Student
            </h2>

          </div>

          <h1
            style={{
              marginTop: 25,
              color: "#38bdf8",
              fontSize: 42,
              fontWeight: 800,
            }}
          >
            {name}
          </h1>

          <br />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >

            <FaCheckCircle
              color={scoreColor}
            />

            <h3>
              Recognition Score
            </h3>

          </div>

          {/* SCORE BOX */}

          <motion.div

            animate={{
              scale: [1,1.03,1],
            }}

            transition={{
              repeat: Infinity,
              duration: 2,
            }}

            style={{

              marginTop: 20,

              background:
                "rgba(255,255,255,0.08)",

              padding: 18,

              borderRadius: 18,

              textAlign: "center",

              fontSize: 34,

              fontWeight: 800,

              color: scoreColor,

              boxShadow:
                `0 0 20px ${scoreColor}`,

            }}
          >

            {score.toFixed(1)}%

          </motion.div>

          {/* AI PROGRESS BAR */}

          <div
            style={{
              marginTop: 25,
            }}
          >

            <div
              style={{
                width: "100%",
                height: 18,
                background:
                  "rgba(255,255,255,0.1)",
                borderRadius: 20,
                overflow: "hidden",
              }}
            >

              <motion.div

                initial={{
                  width: 0,
                }}

                animate={{
                  width: `${score}%`,
                }}

                transition={{
                  duration: 0.7,
                }}

                style={{
                  height: "100%",
                  background: scoreColor,
                  borderRadius: 20,
                  boxShadow:
                    `0 0 15px ${scoreColor}`,
                }}
              />

            </div>

          </div>

          {/* AI STATUS */}

          <motion.div

            animate={{
              opacity: [0.7,1,0.7],
            }}

            transition={{
              repeat: Infinity,
              duration: 2,
            }}

            style={{

              marginTop: 25,

              textAlign: "center",

              fontSize: 18,

              fontWeight: 600,

              color: scoreColor,

            }}
          >

            {score > 90 &&
              "Highly Accurate Match"
            }

            {score > 75 &&
              score <= 90 &&
              "Moderate Confidence"
            }

            {score <= 75 &&
              "Low Confidence Detection"
            }

          </motion.div>

        </motion.div>

      </div>

    </motion.div>
  );
}

export default Attendance;