import React, { Fragment, useState, useEffect } from "react";
import { toast } from "react-toastify";

const InputTodo = ({ setVouchersChange }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [allCategories, setAllCategories] = useState([]);

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
  });

  const onSubmitForm = async (e) => {
    e.preventDefault();

    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);

      const body = { name, type, value, date, category };
      if (!body.type || !body.category) {
        toast.error("Complete all the fields");
      } else if (body.name && body.type && body.category) {
        toast.success("Voucher registered!");
        console.log(body);
        const response = await fetch(
          "http://localhost:5000/dashboard/vouchers",
          {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(body),
          }
        );

        const parsedResponse = await response.json();

        console.log(parsedResponse);
        setVouchersChange(true);
        setName("");
        setType("");
        setValue("");
        setCategory("");
        setDate("");
      }

      // window.location = "/";
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <h1 className="text-center mt-5">PERN Voucher's</h1>
      <div className="flex pl-5">
        <form className="form-group mt-5 text-center " onSubmit={onSubmitForm}>
          <input
            type="text"
            className="form-control"
            placeholder="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select
            className="form-control mt-2"
            name="type"
            onChange={(e) => setType(e.target.value)}
            value={type}
          >
            <option>Select a Type</option>
            <option value="Asset">Asset</option>
            <option value="Liability">Liability</option>
          </select>
          <input
            type="number"
            className="form-control mt-2"
            placeholder="value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <input
            type="date"
            className="form-control mt-2"
            placeholder="date"
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
          <button className="btn btn-success form-control mt-2">Add</button>
        </form>
      </div>
    </Fragment>
  );
};

export default InputTodo;
