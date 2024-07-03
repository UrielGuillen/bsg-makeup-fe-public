import { Appointments } from '../app/interfaces/appointments.interface';
import { LoadingStatus } from '../app/enums/loading-status.enum';
import { ServicesCatalog } from '../app/interfaces/services-catalog.interface';
import { UserData } from '../app/interfaces/user-data.interface';
import { Agenda } from '../app/interfaces/agenda-interface';
import { ManualUsers } from '../app/interfaces/manual-users-response.interface';
import { Notification } from '../app/interfaces/notifications.interface';

export interface AppState {
  configurationState: ConfigurationState;
  appointmentsState: AppointmentsState;
  authenticationState: UserState;
}

export interface AppointmentsState {
  selectedDate: string;
  hourSelected: Agenda;
  scheduledAppointments: Array<Appointments>;
  historyUserAppointments: Array<Appointments>;
  manualUsers: Array<ManualUsers>;
}

export interface ConfigurationState {
  loadingStatus: LoadingStatus;
  servicesList: Array<ServicesCatalog>;
}

export interface UserState {
  isUserAuthenticated: boolean;
  userData: UserData;
  notifications: Array<Notification>;
}
