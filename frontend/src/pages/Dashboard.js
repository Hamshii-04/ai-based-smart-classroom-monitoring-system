import React, {
  useEffect,
  useState,
} from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { motion } from "framer-motion";

import {
  FaUsers,
  FaClipboardCheck,
  FaServer,
} from "react-icons/fa";

import {
  getAttendance,
  exportCSV,
  getStudentCount,
} from "../services/api";

function Dashboard() {

  const [chartData, setChartData] =
    useState([]);

  const [studentCount,
    setStudentCount] =
    useState(0);

  const [totalAttendance,
    setTotalAttendance] =
    useState(0);

  // FETCH DATA

  const fetchAttendance = () => {

    // ATTENDANCE

    getAttendance()
      .then((res) => res.json())
      .then((data) => {

        const counts = {};

        data.forEach((row) => {

          counts[row.name] =
            (counts[row.name] || 0) + 1;

        });

        const formatted =
          Object.keys(counts).map(
            (name) => ({

              name,

              attendance:
                counts[name],

            })
          );

        setChartData(formatted);

        setTotalAttendance(

          formatted.reduce(
            (a, b) =>
              a + b.attendance,
            0
          )

        );

      });

    // STUDENT COUNT

    getStudentCount()
      .then((res) => res.json())
      .then((data) => {

        setStudentCount(
          data.count
        );

      });

  };

  // AUTO REFRESH

  useEffect(() => {

    fetchAttendance();

    const interval =
      setInterval(() => {

        fetchAttendance();

      }, 3000);

    return () =>
      clearInterval(interval);

  }, []);

  // PIE DATA

  const pieData = [

    {
      name: "Attendance",
      value: totalAttendance,
    },

    {
      name: "Students",
      value: studentCount,
    },

  ];

  const COLORS = [
    "#38bdf8",
    "#8b5cf6",
  ];

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
          fontSize: 42,
        }}
      >
        AI Dashboard
      </h1>

      {/* CARDS */}

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit, minmax(250px,1fr))",

          gap: 25,

          marginBottom: 40,
        }}
      >

        <DashboardCard
          title="Students"
          value={studentCount}
          icon={<FaUsers />}
          color="#38bdf8"
        />

        <DashboardCard
          title="Attendance Entries"
          value={totalAttendance}
          icon={
            <FaClipboardCheck />
          }
          color="#22c55e"
        />

        <DashboardCard
          title="System"
          value="Active"
          icon={<FaServer />}
          color="#8b5cf6"
        />

      </div>

      {/* CHARTS */}

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "2fr 1fr",

          gap: 25,

          marginBottom: 30,
        }}
      >

        {/* BAR CHART */}

        <motion.div
          whileHover={{
            scale: 1.01,
          }}
          className="glass glow"
          style={{
            padding: 25,
            borderRadius: 25,
            height: 450,
          }}
        >

          <h2
            style={{
              marginBottom: 20,
            }}
          >
            Attendance Analytics
          </h2>

          <ResponsiveContainer
            width="100%"
            height="90%"
          >

            <BarChart
              data={chartData}
            >

              <XAxis
                dataKey="name"
              />

              <YAxis />

              <Tooltip
  contentStyle={{
    background: "#0f172a",
    border: "none",
    borderRadius: 15,
    color: "white",
  }}

  formatter={(value) => [
    value,
    "Attendance"
  ]}

  labelFormatter={(label) =>
    `Student: ${label}`
  }
/>

              <Bar
                dataKey="attendance"
                radius={[10,10,0,0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </motion.div>

        {/* PIE CHART */}

        <motion.div
          whileHover={{
            scale: 1.01,
          }}
          className="glass glow"
          style={{
            padding: 25,
            borderRadius: 25,
            height: 450,
          }}
        >

          <h2
            style={{
              marginBottom: 20,
            }}
          >
            Overview
          </h2>

          <ResponsiveContainer
            width="100%"
            height="90%"
          >

            <PieChart>

              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={120}
                label
              >

                {pieData.map(
                  (entry, index) => (

                    <Cell
                      key={index}
                      fill={
                        COLORS[index]
                      }
                    />

                  )
                )}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </motion.div>

      </div>

      {/* EXPORT BUTTON */}

      <motion.button
        whileHover={{
          scale: 1.05,
        }}
        whileTap={{
          scale: 0.95,
        }}
        onClick={() =>
          window.open(exportCSV())
        }
        style={{

          padding: 15,

          background:
            "linear-gradient(90deg,#2563eb,#7c3aed)",

          border: "none",

          borderRadius: 15,

          color: "white",

          cursor: "pointer",

          fontSize: 16,

          fontWeight: 600,

          boxShadow:
            "0 0 20px rgba(99,102,241,0.5)",

        }}
      >
        Download Attendance CSV
      </motion.button>

    </motion.div>
  );
}

// DASHBOARD CARD

function DashboardCard({

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

        padding: 30,

        borderRadius: 25,

      }}
    >

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 15,
        }}
      >

        <div
          style={{
            fontSize: 28,
            color,
          }}
        >
          {icon}
        </div>

        <h3>{title}</h3>

      </div>

      <h1
        style={{
          marginTop: 20,
          color,
          fontSize: 42,
        }}
      >
        {value}
      </h1>

    </motion.div>
  );
}

export default Dashboard;