import * as React from "react";
import { Alert, Snackbar } from "@mui/material";
import styles from "./NotificationWidget.scss";
import { connectToState } from "./NotificationWidget.connect";
import { NotificationWidgetBaseProps } from "./NotificationWidget.types";

const TIMEOUT = 6000;

const NotificationWidgetBase = (props: NotificationWidgetBaseProps) => {

    const { notifications } = props;
    const handleClose = (id: string
    ) => {
        id && props.closeNotification(id);
    };

    return (
        <>
            {
                Object.keys(notifications).map((key) => {
                    const notification = notifications[key];
                    if (!notification) {
                        return;
                    }
                    return (
                        <Snackbar
                            id={key}
                            key={key}
                            open={true}
                            className={styles.AlertSnackbar}
                            autoHideDuration={notification.timeout ?? TIMEOUT}
                            onClose={() => { handleClose(key); }}
                        >
                            <Alert
                                id={key}
                                onClose={() => { handleClose(key); }}
                                severity={notification.type}
                                sx={{ width: "100%" }}
                            >
                                {notification?.message}
                            </Alert>
                        </Snackbar>
                    );
                })
            }
        </>
    );
};

export default connectToState(NotificationWidgetBase);