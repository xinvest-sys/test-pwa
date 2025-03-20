import { TNotificationLog } from './TNotificationLog';

export type TNotificationLogInfo = {
	summary: {
		periods: string[]
	}
	logs: TNotificationLog[]
}