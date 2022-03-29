import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import InputVoucher from "./vouchers/InputVoucher";
import ListVouchers from "./vouchers/ListVouchers";

const Dashboard = ({ setAuth }) => {
  const [name, setName] = useState("");
  const [allVouchers, setAllVouchers] = useState([]);
  const [vouchersChange, setVouchersChange] = useState(false);

  const getName = async () => {
    try {
      const response = await fetch("http://localhost:5000/dashboard/", {
        method: "GET",
        headers: { token: localStorage.token },
      });
      const parsedRes = await response.json();
      setAllVouchers(parsedRes.reverse());
      setName(parsedRes[0].user_name);
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
    setVouchersChange(false);
  }, [vouchersChange]);
  return (
    <>
      <div className="d-flex mt-5 justify-content-around">
        {" "}
        <h2>{name}, personal budget</h2>
        <button className="btn btn-primary" onClick={(e) => logout(e)}>
          Logout
        </button>
      </div>

      <InputVoucher setVouchersChange={setVouchersChange} />

      <ListVouchers
        setVouchersChange={setVouchersChange}
        allVouchers={allVouchers}
      />
    </>
  );
};

export default Dashboard;
