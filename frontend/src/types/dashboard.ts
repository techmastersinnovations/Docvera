export interface Appointment {
  id: string;

  patient_name: string;

  specialization?: string;

  booking_date: string;

  start_time: string;

  end_time: string;

  status: string;

  base_amount: number;

  clinic_name?: string;

  clinic_address?: string;

  clinic_city?: string;
}

export interface DashboardStats {
  totalEarnings: number;

  patientsSeen: number;

  pendingAppointments: number;
}

export interface ProfileMessage {
  type:
    | "success"
    | "error";

  text: string;
}

export interface AvailabilitySlot {
  day_of_week: string;

  start_time: string;

  end_time: string;

  slot_duration_minutes: number;
}

export interface DoctorDashboardHook {
  appointments:
    Appointment[];

  loading: boolean;

  stats:
    DashboardStats;

  clinicName: string;

  clinicAddress: string;

  clinicCity: string;

  consultationFees: string;

  profileMessage:
    ProfileMessage | null;

  newSlot:
    AvailabilitySlot;

  pendingAppointments:
    Appointment[];

  paidAppointments:
    Appointment[];

  completedAppointments:
    Appointment[];

  setClinicName:
    React.Dispatch<
      React.SetStateAction<string>
    >;

  setClinicAddress:
    React.Dispatch<
      React.SetStateAction<string>
    >;

  setClinicCity:
    React.Dispatch<
      React.SetStateAction<string>
    >;

  setConsultationFees:
    React.Dispatch<
      React.SetStateAction<string>
    >;

  setNewSlot:
    React.Dispatch<
      React.SetStateAction<AvailabilitySlot>
    >;

  handleStatusChange: (
    id: string,
    status: string
  ) => Promise<void>;

  handleProfileUpdate: (
    e: React.FormEvent
  ) => Promise<void>;

  handleAddAvailability: (
    e: React.FormEvent
  ) => Promise<void>;

  showAllCompleted: boolean;
  setShowAllCompleted: React.Dispatch<React.SetStateAction<boolean>>;
}