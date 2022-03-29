const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

// all vouchers and name

router.get("/", authorization, async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT u.user_name,u.user_email,v.voucher_name,v.voucher_type,v.voucher_id,v.voucher_value,v.voucher_date,v.category_id FROM users AS u LEFT JOIN vouchers AS v ON u.user_id = v.user_id WHERE u.user_id = $1",
      [req.user.id]
    );
    res.json(user.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

// crud category
router.get("/category", async (req, res) => {
  try {
    // "SELECT u.user_name,u.user_email,v.voucher_name,v.voucher_type,v.voucher_value,v.voucher_date FROM users AS u LEFT JOIN vouchers AS v ON u.user_id = v.user_id WHERE u.user_id = $1"
    const category = await pool.query(
      "SELECT c.category_name,c.category_id,v.voucher_id FROM category AS c LEFT JOIN vouchers AS v ON c.category_id = v.category_id"
    );
    res.json(category.rows);
  } catch (err) {
    console.error(err.message);
  }
});

router.post("/category", async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = await pool.query(
      "INSERT INTO category (category_name) VALUES ($1) RETURNING *",
      [name]
    );
    res.json(newCategory.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

router.put("/category/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    await pool.query(
      "UPDATE category SET category_name = $1 WHERE category_id = $2 RETURNING *",
      [name, id]
    );
    res.json("Category was updated");
  } catch (err) {
    console.error(err.message);
  }
});

router.delete("/category/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      "DELETE FROM category WHERE category_id = $1 RETURNING *",
      [id]
    );
    res.json("Category was deleted");
  } catch (err) {
    console.error(err.message);
  }
});

// crud vouchers
router.post("/vouchers", authorization, async (req, res) => {
  try {
    const { name, category, type, value, date } = req.body;
    const newVoucher =
      type !== "" &&
      (await pool.query(
        "INSERT INTO vouchers (user_id,category_id,voucher_name,voucher_type,voucher_value,voucher_date) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
        [req.user.id, category, name, type, value, date]
      ));
    res.json(newVoucher.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

router.put("/vouchers/:id", authorization, async (req, res) => {
  const { id } = req.params;
  const { name, category, type, value, date } = req.body;
  const updateVoucher = await pool.query(
    "UPDATE vouchers SET (voucher_name,category_id,voucher_type,voucher_value,voucher_date) = ($1,$2,$3,$4,$5) WHERE voucher_id = $6 AND user_id = $7 RETURNING *",
    [name, category, type, value, date, id, req.user.id]
  );
  if (updateVoucher.rows.length === 0) {
    res.json("This voucher is not yours");
  }
  res.json("Voucher was updated");
});

router.delete("/vouchers/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query(
      "DELETE FROM vouchers WHERE voucher_id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.id]
    );
    if (deleteTodo.rows.length === 0) {
      res.json("This Voucher is not yours");
    }
    res.json("Voucher was deleted");
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
