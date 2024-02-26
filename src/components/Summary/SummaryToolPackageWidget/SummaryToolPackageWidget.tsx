import React from "react";
import styles from "./SummaryToolPackageWidget.scss";
import Button from "@mui/material/Button";
import { ShoppingCart } from "@mui/icons-material";
import ToolPackageListItem from "../ToolPackageListItem/ToolPackageListItem";

const SummaryToolPackageWidget: React.FC = () => {
    const data = [
        {
            role: "Holder",
            designation: "R217.49-1620.RE-XO12-45.3A",
            amount: 1,
            featureCount: 3,
        },
        {
            role: "Holder",
            designation: "R217.49-1620.RE-XO12-45.3A",
            amount: 1,
            featureCount: 3,
        },
        {
            role: "Holder",
            designation: "R217.49-1620.RE-XO12-45.3A",
            amount: 1,
            featureCount: 3,
        },
        {
            role: "Holder",
            designation: "R217.49-1620.RE-XO12-45.3A",
            amount: 1,
            featureCount: 3,
        },
        {
            role: "Holder",
            designation: "R217.49-1620.RE-XO12-45.3A",
            amount: 1,
            featureCount: 3,
        },
        {
            role: "Holder",
            designation: "R217.49-1620.RE-XO12-45.3A",
            amount: 1,
            featureCount: 3,
        },
        {
            role: "Holder",
            designation: "R217.49-1620.RE-XO12-45.3A",
            amount: 1,
            featureCount: 3,
        },
        {
            role: "Holder",
            designation: "R217.49-1620.RE-XO12-45.3A",
            amount: 1,
            featureCount: 3,
        },
        {
            role: "Holder",
            designation: "R217.49-1620.RE-XO12-45.3A",
            amount: 1,
            featureCount: 3,
        },
        {
            role: "Holder",
            designation: "R217.49-1620.RE-XO12-45.3A",
            amount: 1,
            featureCount: 3,
        },
        {
            role: "Holder",
            designation: "R217.49-1620.RE-XO12-45.3A",
            amount: 1,
            featureCount: 3,
        },
    ];
    return (
        <div className="h-full flex flex-col">
            <div className={styles.ToolHeader}>
                <div className={styles.HeaderText}>Tool package</div>
                <Button
                    variant="contained"
                    startIcon={<ShoppingCart />}
                    style={{ textTransform: "none", fontSize: "16px" }}
                >
                    Order tools
                </Button>
            </div>
            <table>
                <tr className={styles.tableHeader}>
                    <th></th>
                    <th className={styles.HeaderText}>Tool</th>
                    <th className={styles.HeaderText}>Stock</th>
                    <th className={styles.HeaderText}>Amount</th>
                    <th className={styles.featureText}>Number of features</th>
                </tr>
                <tbody>
                    {data.map((item, index) => (
                        <ToolPackageListItem key={index} item={item} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SummaryToolPackageWidget;
