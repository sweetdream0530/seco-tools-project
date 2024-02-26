export interface SagaAction<type> {
  type: string;
  payload: type;
}

export type NotificationType = "info" | "success" | "warning" | "error";
export const NotificationTypes = {
    info: "info" as NotificationType,
    success: "success" as NotificationType,
    warning: "warning" as NotificationType,
    error: "error" as NotificationType
};

export interface INotification {
  id: string;
  message: string;
  type?: NotificationType;
  timeout?: number;
}
