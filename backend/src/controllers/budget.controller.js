const pool = require('../config/db');

/**
 * GET /api/trips/:id/budget
 *
 * Returns full cost breakdown:
 * - Total trip cost
 * - Breakdown by: transport, accommodation, activities
 * - Per-stop costs
 * - Per-day costs (for calendar heat map / warnings)
 * - Budget remaining (if budget_limit set)
 * - Over-budget days flagged
 */
const getTripBudget = async (req, res) => {
  const { id } = req.params;
  try {
    // Verify access
    const tripRes = await pool.query(
      'SELECT * FROM trips WHERE id = $1 AND (user_id = $2 OR is_public = TRUE)',
      [id, req.user.id]
    );
    if (tripRes.rows.length === 0) return res.status(404).json({ error: 'Trip not found' });
    const trip = tripRes.rows[0];

    // ── Per-stop cost breakdown ─────────────────────────────────
    const stopBreakdown = await pool.query(
      `SELECT
         ts.id AS stop_id,
         c.name AS city_name,
         c.currency_code,
         ts.arrival_date,
         ts.departure_date,
         ts.accommodation_cost,
         ts.transport_cost,
         COALESCE(SUM(COALESCE(sa.custom_cost, a.cost, 0)), 0)  AS activities_cost,
         ts.accommodation_cost + ts.transport_cost +
           COALESCE(SUM(COALESCE(sa.custom_cost, a.cost, 0)), 0) AS stop_total
       FROM trip_stops ts
       JOIN cities c ON c.id = ts.city_id
       LEFT JOIN stop_activities sa ON sa.stop_id = ts.id
       LEFT JOIN activities a ON a.id = sa.activity_id
       WHERE ts.trip_id = $1
       GROUP BY ts.id, c.name, c.currency_code
       ORDER BY ts.order_index`,
      [id]
    );

    // ── Per-day cost breakdown (for calendar) ───────────────────
    const dayBreakdown = await pool.query(
      `SELECT
         d::date AS day,
         COALESCE(SUM(COALESCE(sa.custom_cost, a.cost, 0)), 0) AS activities_cost
       FROM trip_stops ts
       CROSS JOIN LATERAL generate_series(ts.arrival_date, ts.departure_date, '1 day'::interval) AS d
       LEFT JOIN stop_activities sa ON sa.stop_id = ts.id AND sa.scheduled_date = d::date
       LEFT JOIN activities a ON a.id = sa.activity_id
       WHERE ts.trip_id = $1
       GROUP BY d
       ORDER BY d`,
      [id]
    );

    // ── Category totals (for pie chart) ────────────────────────
    const totals = stopBreakdown.rows.reduce(
      (acc, stop) => {
        acc.transport     += parseFloat(stop.transport_cost) || 0;
        acc.accommodation += parseFloat(stop.accommodation_cost) || 0;
        acc.activities    += parseFloat(stop.activities_cost) || 0;
        return acc;
      },
      { transport: 0, accommodation: 0, activities: 0 }
    );
    const grandTotal = totals.transport + totals.accommodation + totals.activities;

    // ── Trip duration in days ───────────────────────────────────
    const startDate = new Date(trip.start_date);
    const endDate = new Date(trip.end_date);
    const durationDays = Math.max(1, Math.round((endDate - startDate) / 86400000) + 1);

    // ── Budget warnings per day ─────────────────────────────────
    const dailyBudget = trip.budget_limit > 0 ? trip.budget_limit / durationDays : null;
    const daysWithWarnings = dayBreakdown.rows.map(day => ({
      ...day,
      status: dailyBudget
        ? day.activities_cost > dailyBudget ? 'over'
          : day.activities_cost > dailyBudget * 0.8 ? 'warning'
          : 'ok'
        : 'ok',
    }));

    res.json({
      trip_id: id,
      trip_title: trip.title,
      budget_limit: parseFloat(trip.budget_limit) || 0,
      grand_total: parseFloat(grandTotal.toFixed(2)),
      budget_remaining: trip.budget_limit > 0 ? parseFloat((trip.budget_limit - grandTotal).toFixed(2)) : null,
      duration_days: durationDays,
      avg_cost_per_day: parseFloat((grandTotal / durationDays).toFixed(2)),
      category_breakdown: {
        transport:     parseFloat(totals.transport.toFixed(2)),
        accommodation: parseFloat(totals.accommodation.toFixed(2)),
        activities:    parseFloat(totals.activities.toFixed(2)),
      },
      stops: stopBreakdown.rows,
      days: daysWithWarnings,
    });
  } catch (err) {
    console.error('getTripBudget:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getTripBudget };
