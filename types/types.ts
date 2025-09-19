export type DataOfLogType = {
    farmId: string,
    activityType: string,
    description: string,
    geoLocation: any | null,
    id: string,
    timestamp: string
}

export enum AlertCategory {
  WEATHER = "weather",
  SCHEME = "scheme",
  PEST = "pest",
  MARKET = "market",
  IRRIGATION = "irrigation",
}

export enum AlertStatus {
  UNREAD = "unread",
  READ = "read",
//   COMPLETED = "completed",
}

export type AlertType = {
  alertType: AlertCategory;
  message: string;
  dueDate: number;
  status: AlertStatus;
  priority: number;
};
