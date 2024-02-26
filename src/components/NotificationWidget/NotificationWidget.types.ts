import { INotification } from "~/store/common/types";

export interface NotificationWidgetBaseProps {
    closeNotification: (id: string) => void;

    notifications: {[key: string]: INotification};
}