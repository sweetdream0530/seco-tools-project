import * as React from "react";
import Button from "@mui/material/Button";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./FeedbackWidget.scss";
import { showNotification } from "~/utils/events";
import isEmail from "validator/lib/isEmail";
import { isNumber } from "lodash";
import { sendFeedback } from "~/store/data/data";
import StyledTextField from "../../StyledTextFieldWidget";
import { FeedbackWidgetBaseProps, FeedbackWidgetBaseState } from "./FeedbackWidget.types";
import { connectToState } from "./FeedbackWidget.connect";
import UploadFilesWidget from "./UploadFilesWidget";

export class FeedbackWidgetBase extends React.Component<FeedbackWidgetBaseProps, FeedbackWidgetBaseState> {
    private _init_state = {
        files: [],
        email: "",
        title: "",
        material: "",
        axes: "",
        actualResult: "",
        expectedResult: "",
        isEmailValid: true,
        isTitleValid: true,
        submitDisabled: false
    };

    constructor(props: any) {
        super(props);
        this.state = {
            expanded: false,
            ...this._init_state
        };
    }

    getFileName(fileName: string, idx: number) {
        if (idx === 0) {
            return fileName;
        }

        let checkName = fileName, ext = "";
        if (checkName.indexOf(".") > -1) {
            const tokens = checkName.split("."); ext = "." + tokens.pop();
            checkName = tokens.join(".");
        }
        return `${checkName} (${idx})${ext}`;
    }

    onDrop (acceptedFiles: any) {
        const { files } = this.state;
        const fileNameDict = {} as any;
        const processedFiles = [...files, ...acceptedFiles].map((obj: any) => {
            const file = obj.file ?? obj;
            if (isNumber(fileNameDict[file.name])) {
                fileNameDict[file.name] += 1;
            }
            else {
                fileNameDict[file.name] = 0;
            }

            return {
                file,
                name: this.getFileName(file.name, fileNameDict[file.name])
            };
        });

        this.setState({
            files: processedFiles
        });
    }

    handleEmailChange (event: React.ChangeEvent<HTMLInputElement>) {
        const { value } = event.target;
        this.setState({
            isEmailValid: isEmail(value),
            email: value
        });
    }

    handleTitleChange (event: React.ChangeEvent<HTMLInputElement>) {
        const { value } = event.target;
        this.setState({
            isTitleValid: value.trim().length > 0,
            title: value
        });
    }

    handleSubmit(event: React.SyntheticEvent) {
        event.preventDefault();
        const { isEmailValid, isTitleValid } = this.state;
        if (!isEmailValid || !isTitleValid) {
            return;
        }

        this.props.loading();
        this.setState({
            submitDisabled: true
        }, () => {
            const { email, title, material, axes, actualResult, expectedResult, files, expanded } = this.state;
            sendFeedback({
                email,
                title,
                material,
                axes,
                actualResult,
                expectedResult,
                files,
            }).then((data: any) => {
                this.props.loadingDone();
                let tmpState = { expanded, submitDisabled: false};
                if (data) {
                    tmpState = { ...this._init_state, ...tmpState, expanded: false};
                    showNotification({
                        id: Date.now().toString(),
                        message: "Thank you! Your feedback has been successfully submitted.",
                        type: "success",
                    });
                }
                this.setState(tmpState);
            });
        });
    }

    removeItem (index: number) {
        const { files } = this.state;
        const updatedItems = [...files];
        updatedItems.splice(index, 1);
        this.setState({files: updatedItems});
    }

    render() {
        const {
            expanded,
            files,
            isEmailValid,
            isTitleValid,
            email,
            title,
            material, 
            axes,
            actualResult,
            expectedResult,
            submitDisabled
        } = this.state;
    
        return (
            <>
                <Grid
                    className={styles.feedbackFormToggleButton}
                    onClick={() => this.setState({expanded: !expanded})}
                >
                    Feedback
                </Grid>
                <Dialog
                    className={styles.feedbackDialog}
                    onClose={() => this.setState({expanded: false})}
                    open={expanded}
                >
                    <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                        Feedback
                    </DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={() => this.setState({expanded: false})}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <DialogContent className={styles.feedbackContent} dividers>
                        <form onSubmit={this.handleSubmit.bind(this)} action="/">
                            <span
                                style={
                                    isEmailValid
                                        ? { display: "none" }
                                        : { color: "red", display: "block", marginBottom: "12px" }
                                }
                            >
                                Please enter correct e-mail.
                            </span>
                            <StyledTextField
                                type="email"
                                variant="outlined"
                                error={!isEmailValid}
                                color="secondary"
                                label="E-mail"
                                onChange={this.handleEmailChange.bind(this)}
                                value={email}
                                fullWidth
                                required
                                sx={{ mb: 4 }}
                            />
                            <span
                                style={
                                    isTitleValid
                                        ? { display: "none" }
                                        : { color: "red", display: "block", marginBottom: "12px" }
                                }
                            >
                                Title cannot be empty.
                            </span>
                            <StyledTextField
                                type="text"
                                variant="outlined"
                                color="secondary"
                                label="Issue title"
                                error={!isTitleValid}
                                onChange={this.handleTitleChange.bind(this)}
                                value={title}
                                fullWidth
                                multiline
                                required
                                minRows={1}
                                maxRows={5}
                                sx={{ mb: 4 }}
                            />
                            <StyledTextField
                                type="text"
                                variant="outlined"
                                color="secondary"
                                label="Selected material"
                                onChange={(e) => this.setState({material: e.target.value})}
                                value={material}
                                placeholder="Example: P1"
                                fullWidth
                                sx={{ mb: 4 }}
                            />
                            <StyledTextField
                                type="text"
                                variant="outlined"
                                color="secondary"
                                label="Selected axes"
                                onChange={(e) => this.setState({axes: e.target.value})}
                                value={axes}
                                placeholder="Example: X, -Y"
                                fullWidth
                                sx={{ mb: 4 }}
                            />
                            <StyledTextField
                                type="text"
                                variant="outlined"
                                color="secondary"
                                label="Actual results"
                                onChange={(e) => this.setState({actualResult: e.target.value})}
                                value={actualResult}
                                placeholder="Describe behavior that you experience attaching necessary screenshots to the letter"
                                fullWidth
                                multiline
                                minRows={1}
                                maxRows={5}
                                sx={{ mb: 4 }}
                            />
                            <StyledTextField
                                type="text"
                                variant="outlined"
                                color="secondary"
                                label="Expected results"
                                onChange={(e) => this.setState({expectedResult: e.target.value})}
                                value={expectedResult}
                                placeholder="Describe behavior that you were expected or your suggestions"
                                fullWidth
                                multiline
                                minRows={1}
                                maxRows={5}
                                sx={{ mb: 4 }}
                            />
    
                            <UploadFilesWidget files={files} removeItem={this.removeItem.bind(this)} onDrop={this.onDrop.bind(this)} />
                            <Button
                                disabled={submitDisabled}
                                className={styles.feedbackSubmitButton}
                                variant="outlined"
                                color="secondary"
                                type="submit"
                            >
                                Submit feedback
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </>
        );
    }

}

export default connectToState((FeedbackWidgetBase));