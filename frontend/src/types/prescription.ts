export interface PrescriptionMedicine {
  medicine_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface PrescriptionData {
  appointment_id: string;
  patient_name: string;
  diagnosis: string;
  notes: string;
  medicines: PrescriptionMedicine[];
  vitals?: {
    blood_pressure?: string;
    pulse_rate?: string;
    temperature?: string;
    oxygen_saturation?: string;
    weight?: string;
    height?: string;
  };
}

export interface PrescriptionHistoryItem {
  id: string;
  created_at: string;
  diagnosis: string;
  notes: string;
  medicines: PrescriptionMedicine[];
  vitals?: {
    blood_pressure?: string;
    pulse_rate?: string;
    temperature?: string;
    oxygen_saturation?: string;
    weight?: string;
    height?: string;
  } | null;
}

export interface PrescriptionHook {
  medicines: PrescriptionMedicine[];
  diagnosis: string;
  notes: string;

  setDiagnosis:
    React.Dispatch<
      React.SetStateAction<string>
    >;

  setNotes:
    React.Dispatch<
      React.SetStateAction<string>
    >;

  addMedicine: () => void;

  updateMedicine: (
    index: number,
    field: keyof PrescriptionMedicine,
    value: string
  ) => void;

  removeMedicine: (
    index: number
  ) => void;

  savePrescription:
    () => Promise<void>;

  prescriptionHistory:
    PrescriptionHistoryItem[];

  fetchHistory:
    () => Promise<void>;
}