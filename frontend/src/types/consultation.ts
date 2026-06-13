export interface ConsultationMessage {
  id: string;

  sender: string;

  sender_role:
    | "DOCTOR"
    | "PATIENT";

  message: string;

  created_at: string;
}

export interface ConsultationVitals {
  blood_pressure?: string;

  pulse_rate?: string;

  temperature?: string;

  oxygen_saturation?: string;

  weight?: string;

  height?: string;
}

export interface DiagnosisData {
  symptoms: string;

  diagnosis: string;

  notes: string;
}

export interface PrescriptionMedicine {
  medicine_name: string;

  dosage: string;

  frequency: string;

  duration: string;

  instructions?: string;
}

export interface ConsultationSession {
  appointment_id: string;

  patient_name: string;

  doctor_name: string;

  status: string;

  booking_date: string;

  start_time: string;

  end_time: string;

  diagnosis?: string;

  notes?: string;

  medicines?: PrescriptionMedicine[];

  vitals?: ConsultationVitals | null;

  has_stored_vitals?: boolean;
}

export interface ConsultationHook {
  session:
    ConsultationSession | null;

  messages:
    ConsultationMessage[];

  loading: boolean;

  message: string;

  setMessage:
    React.Dispatch<
      React.SetStateAction<string>
    >;

  vitals:
    ConsultationVitals;

  setVitals:
    React.Dispatch<
      React.SetStateAction<ConsultationVitals>
    >;

  diagnosis:
    DiagnosisData;

  setDiagnosis:
    React.Dispatch<
      React.SetStateAction<DiagnosisData>
    >;

  handleSendMessage:
    () => Promise<void>;

  handleSaveVitals:
    () => Promise<void>;

  handleSaveDiagnosis:
    () => Promise<void>;

  handleCompleteConsultation:
    () => Promise<void>;
}