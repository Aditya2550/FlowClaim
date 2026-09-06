export const analyticsQueries = {
  byCategory:
    "SELECT category, SUM(converted_amount) AS total FROM expenses WHERE company_id = $1 GROUP BY category ORDER BY total DESC",
  byUser:
    "SELECT user_id, COUNT(*) AS count, AVG(converted_amount) AS avg, SUM(converted_amount) AS total FROM expenses WHERE company_id = $1 GROUP BY user_id",
  riskSummary: `SELECT
      CASE
        WHEN converted_amount < 1000 THEN 'LOW'
        WHEN converted_amount < 5000 THEN 'MEDIUM'
        ELSE 'HIGH'
      END AS risk_level,
      COUNT(*) AS count
    FROM expenses
    WHERE company_id = $1
    GROUP BY 1`,
  turnaroundTime: `
    SELECT 
      ROUND(AVG(EXTRACT(EPOCH FROM (updated_at - submitted_at)) / 86400)::numeric, 1) AS avg_days
    FROM expenses
    WHERE company_id = $1
      AND status IN ('approved', 'rejected')
  `,
  riskTrend: `
  SELECT 
    TO_CHAR(submitted_at, 'Mon') AS month,
    EXTRACT(MONTH FROM submitted_at) AS month_num,
    COUNT(*) FILTER (WHERE converted_amount < 1000) AS low,
    COUNT(*) FILTER (WHERE converted_amount >= 1000 AND converted_amount < 5000) AS medium,
    COUNT(*) FILTER (WHERE converted_amount >= 5000) AS high
  FROM expenses
  WHERE company_id = $1
  GROUP BY month, month_num
  ORDER BY month_num
`,
  approvalRate: `
  SELECT 
    TO_CHAR(submitted_at, 'Mon') AS month,
    EXTRACT(MONTH FROM submitted_at) AS month_num,
    COUNT(*) FILTER (WHERE status = 'approved') AS approved,
    COUNT(*) FILTER (WHERE status = 'rejected') AS rejected
  FROM expenses
  WHERE company_id = $1
  GROUP BY month, month_num
  ORDER BY month_num
`,
  monthlyVelocity: `
  SELECT 
    TO_CHAR(submitted_at, 'Dy') AS day,
    submitted_at::date AS date,
    SUM(converted_amount) AS amount
  FROM expenses
  WHERE company_id = $1
    AND submitted_at >= NOW() - INTERVAL '30 days'
  GROUP BY day, date
  ORDER BY date
`,
};
