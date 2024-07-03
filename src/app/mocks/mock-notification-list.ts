import { Notification } from '../interfaces/notifications.interface';

export const MOCK_NOTIFICATIONS_LIST: Array<Notification> = [
  {
    id: '1',
    userIdFrom: '2',
    userIdTo: '3',
    title: 'Test 1',
    content: 'Content 1',
    icon: 'group_add',
    hasBeenRead: false,
    createdAt: new Date().getTime(),
  },
];
