import React, { useState } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Button, TextField, Grid, styled } from "@mui/material";
import { inputLabelClasses } from "@mui/material/InputLabel";
import { store } from "../../store/index";
import { login } from "../../store/auth/actions";

import styles from "./LoginView.scss";
import { showNotification } from "~/utils/events";

const StyledTextField = styled(TextField)`
  /* default */
  .MuiInput-underline:before {
    border-bottom: 2px solid grey;
  }

  /* focused */
  .MuiInput-underline:after {
    border-bottom: 2px solid black;
  }
`;

export default function LoginView() {
    const [loginValue, setLoginValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");

    const handleLoginChange = (event: any) => {
        setLoginValue(event.target.value);
    };

    const handlePasswordChange = (event: any) => {
        setPasswordValue(event.target.value);
    };

    const handleSubmit = async () => {
        if (!loginValue.length) {
            showNotification({
                id: Date.now().toString(),
                message: "Login should not be empty",
                type: "error",
            });
            return;
        }
        if (!passwordValue.length) {
            showNotification({
                id: Date.now().toString(),
                message: "Password should not be empty",
                type: "error",
            });
            return;
        }

        await store.dispatch(login({ login: loginValue, password: passwordValue }));
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <p className={styles.title}>This page is locked</p>
                <LockOutlinedIcon sx={{ fontSize: 55 }} />
                <p className={styles.inputDescription}>
                    Enter the password to access this page
                </p>
                <Grid>
                    <Grid>
                        <StyledTextField
                            variant="standard"
                            label="Enter login"
                            placeholder="Enter login"
                            fullWidth
                            value={loginValue}
                            onChange={handleLoginChange}
                            InputLabelProps={{
                                sx: {
                                    color: "grey",
                                    [`&.${inputLabelClasses.shrink}`]: {
                                        color: "#fff",
                                    },
                                },
                            }}
                        />
                        <StyledTextField
                            variant="standard"
                            label="Enter password"
                            placeholder="Enter password"
                            fullWidth
                            value={passwordValue}
                            onChange={handlePasswordChange}
                            type="password"
                            InputLabelProps={{
                                sx: {
                                    color: "grey",
                                    [`&.${inputLabelClasses.shrink}`]: {
                                        color: "#fff",
                                    },
                                },
                            }}
                        />
                    </Grid>
                    <Grid>
                        <Button
                            variant="contained"
                            className={styles.button}
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}
