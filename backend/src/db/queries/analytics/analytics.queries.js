export const analyticsQueries = {
  byCategory: "SELECT category, SUM(converted_amount) AS total FROM expenses GROUP BY category ORDER BY total DESC",
  byUser: "SELECT user_id, COUNT(*) AS count, AVG(converted_amount) AS avg, SUM(converted_amount) AS total FROM expenses GROUP BY user_id",
  riskSummary: `SELECT
      CASE
        WHEN converted_amount < 1000 THEN 'LOW'
        WHEN converted_amount < 5000 THEN 'MEDIUM'
        ELSE 'HIGH'
      END AS risk_level,
      COUNT(*) AS count
    FROM expenses
    GROUP BY 1`
};
