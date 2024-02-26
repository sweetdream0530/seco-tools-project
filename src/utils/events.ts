import { store } from "../store";
import { INotification, NotificationTypes } from "../store/common/types";
import { pushNotification } from "../store/data/actions";

export const showNotification = (data: INotification) => {
    if (data.message.length > 0) {
        store.dispatch(pushNotification(data));
    }
};

export const showErrorNotification = (message: string) => {
    if (message.length > 0) {
        store.dispatch(pushNotification({
            id: Date.now().toString(),
            message,
            type: NotificationTypes.error,
        }));
    }
};
