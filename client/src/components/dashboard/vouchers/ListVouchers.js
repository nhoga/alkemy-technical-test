import React, { Fragment, useEffect, useState, useCallback } from "react";
import EditVoucher from "./EditVoucher";
import Moment from "moment";
import { toast } from "react-toastify";

const ListTodos = ({ allVouchers, setVouchersChange }) => {
  const [vouchers, setVouchers] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [total, setTotal] = useState("");

  //delete todo function
  const categories = async () => {
    const response = await fetch("http://localhost:5000/dashboard/category", {
      method: "GET",
    });
    const parsedResponse = await response.json();
    const cleanCategories = parsedResponse.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.category_id === value.category_id)
    );
    setAllCategories(cleanCategories);
  };

  const deleteTodo = async (id) => {
    try {
      const deleteTodo = await fetch(
        `http://localhost:5000/dashboard/vouchers/${id}`,
        {
          method: "DELETE",
          headers: { token: localStorage.token },
        }
      );
      setVouchersChange(true);
      toast.success("Voucher deleted!");
      setVouchers(vouchers.filter((voucher) => voucher.id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  // const getTodos = async () => {
  //   try {
  //     const response = await fetch("http://localhost:5000/todos");
  //     const jsonData = await response.json();

  //     setTodos(jsonData);
  //   } catch (err) {
  //     console.error(err.message);
  //   }
  // };

  const generateTotalBudget = useCallback(() => {
    // const assets = allVouchers
    //   .filter((v) => v.voucher_type === "Asset")
    //   .reduce((a, r) => a.voucher_value + r.voucher_value);
    // console.log(assets);
    // setTotal(assets);
    const initialValue = 0;
    const liability = allVouchers
      .filter((v) => v.voucher_type === "Liability")
      .map((l) => l.voucher_value)
      .reduce((prev, asset) => prev + asset, initialValue);
    const assets = allVouchers
      .filter((v) => v.voucher_type === "Asset")
      .map((l) => l.voucher_value)
      .reduce((prev, asset) => prev + asset, initialValue);
    const total = assets - liability;
    setTotal(total);
  }, [allVouchers]);

  useEffect(() => {
    categories();
    setVouchers(allVouchers);
    generateTotalBudget();
  }, [allVouchers, generateTotalBudget]);

  return (
    <Fragment>
      <h2 className="pt-2 pl-5">
        {total === 0 ? (
          <></>
        ) : total > 0 ? (
          <>
            Total: <div className="text-success d-inline">${total}</div>
          </>
        ) : (
          <>
            Total: <div className="text-danger d-inline">${total}</div>
          </>
        )}
      </h2>
      <table className="table mt-5 text-center">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Value</th>
            <th>Date</th>
            <th>Category</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {/*<tr>
      <td>John</td>
      <td>Doe</td>
      <td>john@example.com</td>
    </tr> */}

          {vouchers[0]?.voucher_id !== null &&
            vouchers.map((voucher) => (
              <tr key={voucher.voucher_id}>
                <td>{voucher.voucher_name}</td>
                <td>{voucher.voucher_type}</td>
                <td>
                  {voucher.voucher_value ? <>${voucher.voucher_value}</> : null}
                </td>
                <td>{Moment(voucher.voucher_date).format("DD MMMM YYYY")}</td>
                <td>
                  {allCategories.map((c) =>
                    c.category_id === voucher.category_id ? (
                      <div key={c.category_id}>{c.category_name}</div>
                    ) : null
                  )}
                </td>
                <td>
                  <EditVoucher
                    setVouchersChange={setVouchersChange}
                    voucher={voucher}
                  />
                </td>
                <td>
                  <>
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteTodo(voucher.voucher_id)}
                    >
                      Delete
                    </button>
                  </>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Fragment>
  );
};

export default ListTodos;
