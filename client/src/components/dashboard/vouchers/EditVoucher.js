import React, { Fragment, useState, useEffect } from "react";
import { toast } from "react-toastify";

const EditTodo = ({ voucher, setVouchersChange }) => {
  const [name, setName] = useState(voucher.voucher_name);
  const [type, setType] = useState(voucher.voucher_type);
  const [value, setValue] = useState(voucher.voucher_value);
  const [date, setDate] = useState(voucher.voucher_date);
  const [category, setCategory] = useState(voucher.category_id);
  const [allCategories, setAllCategories] = useState([]);

  //edit description function

  const stayData = (data) => {
    setName(data.voucher_name);
    setType(data.voucher_type);
    setValue(data.voucher_value);
    setDate(data.voucher_date);
    setCategory(data.category_id);
  };

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

  useEffect(() => {
    categories();
  }, []);

  const updateDescription = async () => {
    try {
      const body = { name, type, value, date, category };
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);

      const response = await fetch(
        `http://localhost:5000/dashboard/vouchers/${voucher.voucher_id}`,
        {
          method: "PUT",
          headers: myHeaders,
          body: JSON.stringify(body),
        }
      );
      setVouchersChange(true);
      toast.success("Voucher edited!");

      // window.location = "/";
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <button
        type="button"
        className="btn btn-warning"
        data-toggle="modal"
        data-target={`#id${voucher?.voucher_id}`}
      >
        Edit
      </button>

      {/* 
        id = id10
      */}
      <div className="modal" id={`id${voucher?.voucher_id}`}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Todo</h4>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                onClick={() => stayData(voucher)}
              >
                &times;
              </button>
            </div>

            <div className="modal-body">
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="text"
                disabled
                className="form-control mt-2"
                value={type}
                onChange={(e) => setType(e.target.value)}
              />

              <input
                type="number"
                className="form-control mt-2"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />

              <input
                type="date"
                className="form-control mt-2"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              <select
                className="form-control mt-2"
                name="categories"
                onChange={(e) => setCategory(e.target.value)}
                value={category}
              >
                <option>Categories</option>
                {allCategories.map((c) => {
                  return (
                    <option value={c.category_id} key={c.category_id}>
                      {c.category_name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-warning"
                data-dismiss="modal"
                onClick={(e) => updateDescription(e)}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn-danger"
                data-dismiss="modal"
                onClick={() => stayData(voucher)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default EditTodo;
