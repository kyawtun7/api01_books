const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ GET all items
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM items ORDER BY created_at DESC"
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET single item
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM items WHERE id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST create item
router.post("/", async (req, res) => {
  try {
    const { title, description, image_url, rating } = req.body;

    if (!title || !image_url) {
      return res.status(400).json({ message: "Title and image_url required" });
    }

    const [result] = await db.query(
      "INSERT INTO items (title, description, image_url, rating) VALUES (?, ?, ?, ?)",
      [title, description, image_url, rating || 0]
    );

    res.status(201).json({
      id: result.insertId,
      message: "Item created",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ PUT update item
router.put("/:id", async (req, res) => {
  try {
    const { title, description, image_url, rating } = req.body;

    const [result] = await db.query(
      "UPDATE items SET title=?, description=?, image_url=?, rating=? WHERE id=?",
      [title, description, image_url, rating, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE item
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.query(
      "DELETE FROM items WHERE id=?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ PATCH rating (FIXED + DEBUG)
router.patch("/:id/rating", async (req, res) => {
  try {
    console.log("BODY:", req.body); // 👈 IMPORTANT

    const { rating } = req.body;

    if (rating === undefined) {
      return res.status(400).json({ message: "Rating is required" });
    }

    const [result] = await db.query(
      "UPDATE items SET rating=? WHERE id=?",
      [rating, req.params.id]
    );

    res.status(200).json({ message: "Rating updated" });

  } catch (err) {
    console.error("ERROR:", err); // 👈 IMPORTANT
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;