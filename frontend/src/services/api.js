const BASE_URL = "http://127.0.0.1:8000";

// ---------------- LOGIN ----------------
export const login = async (username, password) => {

  return fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

};

// ---------------- REGISTER ----------------
export const registerFace = async (name, image) => {

  return fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      image,
    }),
  });

};

// ---------------- RECOGNIZE ----------------
export const recognizeFace = async (image) => {

  return fetch(`${BASE_URL}/recognize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image,
    }),
  });

};

// ---------------- ATTENDANCE ----------------
export const getAttendance = async () => {

  return fetch(`${BASE_URL}/attendance`);

};
export const getStudentCount =
  () => fetch(
    "http://127.0.0.1:8000/students/count"
  );

// ---------------- EXPORT CSV ----------------
export const exportCSV = () => {

  return `${BASE_URL}/export`;

};