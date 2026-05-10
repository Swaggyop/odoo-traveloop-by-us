import api from "./api";

export const getTripBudget = async (tripId) => {
  const response = await api.get(`/trips/${tripId}/budget`);
  return response.data;
};
