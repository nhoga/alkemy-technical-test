import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
const Dashboard = ({ setAuth }) => {
  const [name, setName] = useState("");

  const getName = async () => {
    try {
      const response = await fetch("http://localhost:5000/dashboard/", {
        method: "GET",
        headers: { token: localStorage.token },
      });
      const parsedRes = await response.json();
      setName(parsedRes.user_name);
    } catch (err) {
      console.error(err.message);
    }
  };

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setAuth(false);
    toast.success("Logged out succesfully!");
  };

  useEffect(() => {
    getName();
  });
  return (
    <>
      <h1>Dashboard, hello {name}</h1>
      <button className="btn btn-primary" onClick={(e) => logout(e)}>
        Logout
      </button>
    </>
  );
};

export default Dashboard;
