import api from "./api";

export const addActivityToStop = async (tripId, stopId, activityData) => {
  const response = await api.post(`/trips/${tripId}/stops/${stopId}/activities`, activityData);
  return response.data;
};
