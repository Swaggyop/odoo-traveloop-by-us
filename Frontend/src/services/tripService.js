import api from "./api";

export const getMyTrips = async () => {
  const response = await api.get("/trips");
  return response.data;
};

export const createTrip = async (tripData) => {
  const response = await api.post("/trips", tripData);
  return response.data;
};

export const getTripById = async (tripId) => {
  const response = await api.get(`/trips/${tripId}`);
  return response.data;
};

export const addStopToTrip = async (tripId, stopData) => {
  const response = await api.post(`/trips/${tripId}/stops`, stopData);
  return response.data;
};
