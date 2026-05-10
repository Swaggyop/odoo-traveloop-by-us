const pool = require('../config/db');

// ─── PACKING LIST ──────────────────────────────────────────────────

// GET /api/trips/:tripId/packing
const getPackingList = async (req, res) => {
  const { tripId } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM packing_items WHERE trip_id = $1 ORDER BY category, created_at`,
      [tripId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/trips/:tripId/packing
const addPackingItem = async (req, res) => {
  const { tripId } = req.params;
  const { name, category } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  try {
    const result = await pool.query(
      `INSERT INTO packing_items (trip_id, name, category)
       VALUES ($1, $2, $3) RETURNING *`,
      [tripId, name, category || 'other']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// PATCH /api/trips/:tripId/packing/:itemId — toggle packed status
const togglePacked = async (req, res) => {
  const { itemId } = req.params;
  try {
    const result = await pool.query(
      `UPDATE packing_items SET is_packed = NOT is_packed WHERE id = $1 RETURNING *`,
      [itemId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Item not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE /api/trips/:tripId/packing/:itemId
const deletePackingItem = async (req, res) => {
  const { itemId } = req.params;
  try {
    await pool.query('DELETE FROM packing_items WHERE id = $1', [itemId]);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE /api/trips/:tripId/packing — reset all items (mark all unpacked)
const resetPackingList = async (req, res) => {
  const { tripId } = req.params;
  try {
    await pool.query('UPDATE packing_items SET is_packed = FALSE WHERE trip_id = $1', [tripId]);
    res.json({ message: 'Checklist reset' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// ─── TRIP NOTES ────────────────────────────────────────────────────

// GET /api/trips/:tripId/notes
const getNotes = async (req, res) => {
  const { tripId } = req.params;
  const { stopId } = req.query;
  try {
    const result = await pool.query(
      `SELECT * FROM trip_notes
       WHERE trip_id = $1 AND ($2::int IS NULL OR stop_id = $2::int)
       ORDER BY created_at DESC`,
      [tripId, stopId || null]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/trips/:tripId/notes
const addNote = async (req, res) => {
  const { tripId } = req.params;
  const { content, stop_id } = req.body;
  if (!content) return res.status(400).json({ error: 'content is required' });
  try {
    const result = await pool.query(
      `INSERT INTO trip_notes (trip_id, stop_id, content)
       VALUES ($1, $2, $3) RETURNING *`,
      [tripId, stop_id || null, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// PUT /api/trips/:tripId/notes/:noteId
const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const { content } = req.body;
  try {
    const result = await pool.query(
      'UPDATE trip_notes SET content = $1 WHERE id = $2 RETURNING *',
      [content, noteId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Note not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE /api/trips/:tripId/notes/:noteId
const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  try {
    await pool.query('DELETE FROM trip_notes WHERE id = $1', [noteId]);
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getPackingList, addPackingItem, togglePacked, deletePackingItem, resetPackingList,
  getNotes, addNote, updateNote, deleteNote,
};
