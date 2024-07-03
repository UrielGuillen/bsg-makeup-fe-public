import { AppState } from '../../state/state.model';
import { LoadingStatus } from '../enums/loading-status.enum';
import { UserData } from '../interfaces/user-data.interface';
import { formatScheduledDate } from '../utils/date.utils';
import { Agenda } from '../interfaces/agenda-interface';

export const MOCK_INITIAL_STATE: AppState = {
  configurationState: {
    loadingStatus: LoadingStatus.Completed,
    servicesList: [],
  },
  appointmentsState: {
    selectedDate: formatScheduledDate(new Date()),
    hourSelected: {
      id: -1,
      hour: '',
    } as Agenda,
    scheduledAppointments: [],
    historyUserAppointments: [],
    manualUsers: [],
  },
  authenticationState: {
    isUserAuthenticated: false,
    userData: {} as UserData,
    notifications: [],
  },
};
