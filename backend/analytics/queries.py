
# SQL queries for CivicSense Analytics
# These queries read existing tables only.

OVERVIEW_QUERY = """
SELECT
    COUNT(*) AS total_complaints,
    COUNT(*) FILTER (WHERE status = 'resolved')
        AS resolved_complaints,
    COUNT(*) FILTER (WHERE status <> 'resolved')
        AS pending_complaints,
    COALESCE(
        ROUND(
            COUNT(*) FILTER (WHERE status = 'resolved') * 100.0
            / NULLIF(COUNT(*), 0),
            2
        ),
        0
    ) AS resolution_rate
FROM complaints;
"""


CATEGORY_QUERY = """
SELECT
    COALESCE(category, 'Uncategorized') AS category,
    COUNT(*) AS total_complaints
FROM complaints
GROUP BY category
ORDER BY total_complaints DESC;
"""


PRIORITY_QUERY = """
SELECT
    COALESCE(priority_level, 'Not Assigned') AS priority_level,
    COUNT(*) AS total_complaints
FROM complaints
GROUP BY priority_level
ORDER BY total_complaints DESC;
"""


TRENDS_QUERY = """
SELECT
    DATE_TRUNC('month', created_at) AS month,
    COUNT(*) AS total_complaints
FROM complaints
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month;
"""


RESOLUTION_TIME_QUERY = """
WITH resolution_dates AS (
    SELECT
        complaint_id,
        MIN(created_at) AS resolved_at
    FROM complaint_status_history
    WHERE new_status = 'resolved'
    GROUP BY complaint_id
)
SELECT
    COUNT(*) AS resolved_complaints,
    COALESCE(
        ROUND(
            AVG(
                EXTRACT(EPOCH FROM (rd.resolved_at - c.created_at))
                / 3600
            )::numeric,
            2
        ),
        0
    ) AS average_resolution_hours
FROM complaints c
JOIN resolution_dates rd
    ON c.id = rd.complaint_id;
"""
