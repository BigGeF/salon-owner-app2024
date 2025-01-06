import React, { createContext, useState, useContext } from 'react';
import { Appointment } from '../../types';

interface SelectedAppointmentContextType {
  selectedAppointment: Appointment | null;
  setSelectedAppointment: (appointment: Appointment | null) => void;
}

const SelectedAppointmentContext = createContext<SelectedAppointmentContextType | undefined>(undefined);

export const SelectedAppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  return (
    <SelectedAppointmentContext.Provider value={{ selectedAppointment, setSelectedAppointment }}>
      {children}
    </SelectedAppointmentContext.Provider>
  );
};

export const useSelectedAppointmentContext = () => {
  const context = useContext(SelectedAppointmentContext);
  if (!context) {
    throw new Error('useSelectedAppointmentContext must be used within a SelectedAppointmentProvider');
  }
  return context;
};
