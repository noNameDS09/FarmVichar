import { AlertCategory, AlertStatus, AlertType, DataOfLogType } from "@/types/types"

export const mockDataOfLog: DataOfLogType[] = [
  {
    farmId: "AHJbtjc3Vi4OriO5TJmL",
    activityType: "Fertilizer",
    description: "Applied organic manure.",
    geoLocation: null,
    id: "Wd2cTvdp2ETlqNXNeu8e",
    timestamp: "2025-09-19T03:45:54.779358Z"
  },
  {
    farmId: "JNwLmHMe9ya20wNlZ0sS",
    activityType: "Sowing",
    description: "Sowed Uma variety paddy seeds.",
    geoLocation: null,
    id: "iI0ciR54G8uU1t1hVeaJ",
    timestamp: "2025-09-19T03:45:54.447282Z"
  },
  {
    farmId: "AHJbtjc3Vi4OriO5TJmL",
    activityType: "Irrigation",
    description: "Watered the east field for 2 hours.",
    geoLocation: null,
    id: "Wd2cTvdp2ETlqNXNeu8f",
    timestamp: "2025-09-18T03:45:54.779358Z"
  },
  {
    farmId: "JNwLmHMe9ya20wNlZ0sS",
    activityType: "Pest Control",
    description: "Sprayed pesticide on south field.",
    geoLocation: null,
    id: "iI0ciR54G8uU1t1hVeaK",
    timestamp: "2025-09-17T03:45:54.447282Z"
  },
  {
    farmId: "AHJbtjc3Vi4OriO5TJmL",
    activityType: "Harvesting",
    description: "Harvested rice from east field.",
    geoLocation: null,
    id: "Wd2cTvdp2ETlqNXNeu8g",
    timestamp: "2025-09-16T03:45:54.779358Z"
  },
  {
    farmId: "JNwLmHMe9ya20wNlZ0sS",
    activityType: "Monitoring",
    description: "Checked soil moisture levels.",
    geoLocation: null,
    id: "iI0ciR54G8uU1t1hVeaL",
    timestamp: "2025-09-15T03:45:54.447282Z"
  },
]


export const mockAlerts: AlertType[] = [
  {
    alertType: AlertCategory.WEATHER,
    message: "Heavy rain expected tomorrow. Delay fertilizer application.",
    dueDate: Date.now() + 24 * 60 * 60 * 1000, // tomorrow
    status: AlertStatus.UNREAD,
    priority: 5,
  },
  {
    alertType: AlertCategory.SCHEME,
    message: "New subsidy available for drip irrigation. Apply before Sept 30.",
    dueDate: Date.now() + 7 * 24 * 60 * 60 * 1000, // next week
    status: AlertStatus.UNREAD,
    priority: 3,
  },
  {
    alertType: AlertCategory.PEST,
    message: "Brown planthopper infestation reported nearby. Inspect your paddy fields.",
    dueDate: Date.now() + 2 * 24 * 60 * 60 * 1000, // 2 days later
    status: AlertStatus.READ,
    priority: 4,
  },
  // {
  //   alertType: AlertCategory.MARKET,
  //   message: "Rice prices increased by 12% in Kochi market.",
  //   dueDate: Date.now(),
  //   status: AlertStatus.COMPLETED,
  //   priority: 2,
  // },
  {
    alertType: AlertCategory.IRRIGATION,
    message: "Irrigation needed for east field within 48 hours due to dry spell.",
    dueDate: Date.now() + 48 * 60 * 60 * 1000, // 2 days
    status: AlertStatus.UNREAD,
    priority: 5,
  },
]