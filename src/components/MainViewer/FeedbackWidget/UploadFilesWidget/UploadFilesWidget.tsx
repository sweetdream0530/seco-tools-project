import * as React from "react";
import styles from "../FeedbackWidget.scss";
import { useDropzone } from "react-dropzone";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import UploadContainer from "../UploadContainer";
import { FeedbackWidgetProps } from "./UploadFilesWidget.types";

export default function FeedbackWidget(props: FeedbackWidgetProps) {
    const disabled = false;
    const {
        getRootProps,
        getInputProps,
        isDragAccept,
        fileRejections,
    } = useDropzone({
        onDrop: props.onDrop,
        disabled,
        maxFiles: 5,
        maxSize: 50000000,
        accept: {
            "multipart/mixed": [".jpeg", ".jpg", ".png", ".step", ".stp"],
        },
    });

    const acceptedFileItems = props.files.map(({ name }: any, index: number) => (
        <li key={index}>
            <div className={styles.acceptedFiles}>
                {name}
                <div
                    onClick={() => {
                        props.removeItem(index);
                    }}
                >
                    <RemoveCircleOutlineOutlinedIcon className={styles.removeIcon} />
                </div>
            </div>
        </li>
    ));

    const fileRejectionItems = fileRejections.map(({ file, errors }: any) => {
        return (
            <li key={file.path}>
                {file.path}
                <ul>
                    {errors.map((e: any) => (
                        <li key={e.code}>{e.message}</li>
                    ))}
                </ul>
            </li>
        );
    });

    return (
        <>
            <UploadContainer
                {...getRootProps({
                    //+ converts true -> 1, false -> 0
                    accepted: +isDragAccept,
                    disabled,
                })}
            >
                <input {...getInputProps()} />
                <p className={styles.uploadContainerText}>
                                    Drag &lsquo;n&lsquo; drop some files here, or click to select files
                </p>
                <em>
                                    (Only *.jpeg and *.png images and step files will be accepted)
                </em>
            </UploadContainer>
            <aside>
                {acceptedFileItems.length > 0 ? (
                    <>
                        <h4>Accepted files</h4>
                        <ul>{acceptedFileItems}</ul>
                    </>
                ) : null}
                {fileRejectionItems.length > 0 ? (
                    <>
                        <h4>Rejected files</h4>
                        <ul>{fileRejectionItems}</ul>
                    </>
                ) : null}
            </aside>
        </>
    ); 
}