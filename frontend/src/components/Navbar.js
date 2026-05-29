import React from "react";

function Navbar({ setPage }) {

  return (

    <div style={{ marginTop: 20 }}>

      <button onClick={() => setPage("live")}>
        Live
      </button>

      <button onClick={() => setPage("register")}>
        Register
      </button>

      <button onClick={() => setPage("attendance")}>
        Attendance
      </button>

      <button onClick={() => setPage("dashboard")}>
        Admin Dashboard
      </button>

    </div>
  );
}

export default Navbar;