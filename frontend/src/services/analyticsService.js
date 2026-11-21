const ANALYTICS_BASE_URL = "http://127.0.0.1:8000/api/analytics";

export const getAnalyticsOverview = async () => {
  const response = await fetch(`${ANALYTICS_BASE_URL}/overview`);
  if (!response.ok) throw new Error("Failed to fetch overview");
  return response.json();
};

export const getAnalyticsCategories = async () => {
  const response = await fetch(`${ANALYTICS_BASE_URL}/categories`);
  if (!response.ok) throw new Error("Failed to fetch categories");
  return response.json();
};

export const getAnalyticsPriorities = async () => {
  const response = await fetch(`${ANALYTICS_BASE_URL}/priorities`);
  if (!response.ok) throw new Error("Failed to fetch priorities");
  return response.json();
};

export const getAnalyticsTrends = async () => {
  const response = await fetch(`${ANALYTICS_BASE_URL}/trends`);
  if (!response.ok) throw new Error("Failed to fetch trends");
  return response.json();
};

export const getAnalyticsResolutionTime = async () => {
  const response = await fetch(`${ANALYTICS_BASE_URL}/resolution-time`);
  if (!response.ok) throw new Error("Failed to fetch resolution time");
  return response.json();
};