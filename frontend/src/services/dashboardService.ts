import {
  api,
} from "@/lib/api";

import {
  AvailabilitySlot,
} from "@/types/dashboard";

export const fetchDoctorAppointments =
  async () => {

    const response =
      await api.get(
        "/appointments/dashboard/doctor/"
      );

    return response.data;
  };

export const updateAppointmentStatus =
  async (
    id: string,
    status: string
  ) => {

    const response =
      await api.patch(
        `/appointments/${id}/status/`,
        { status }
      );

    return response.data;
  };

export const updateClinicProfile =
  async (data: {
    clinic_name: string;
    clinic_address: string;
    clinic_city: string;
    consultation_fees: number;
  }) => {

    const response =
      await api.patch(
        "/doctors/profile/update/",
        data
      );

    return response.data;
  };

export const createAvailabilitySlot =
  async (
    data: AvailabilitySlot
  ) => {

    const response =
      await api.post(
        "/doctors/availability/",
        data
      );

    return response.data;
  };