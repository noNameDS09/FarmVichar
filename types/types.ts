export type DataOfLogType = {
    farmId: string,
    activityType: string,
    description: string,
    geoLocation: any | null,
    id: string,
    timestamp: string
}

export type AlertType = {
  id: string;
  userId: string;
  alertType: string;
  message: string;
  dueDate: string | null;
  status: string;
  priority: number;
  createdAt: string;
};
