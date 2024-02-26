import React from "react";
import styles from "./ToolPackageListItem.scss";

interface ToolData {
    role: string;
    designation: string;
    amount: number;
    featureCount: number;
}
interface ToolPackageListItemProps {
    item: ToolData;
}
const ToolPackageListItem: React.FC<ToolPackageListItemProps> = ({ item }) => {
    return (
        <tr className={styles.itemContainer}>
            <td align="center">
                <img
                    className={styles.toolImg}
                    src="/assets/images/150x150.png"
                />
            </td>
            <td>
                <div className={styles.toolContainer}>
                    <div className={styles.roleText}>{item.role}</div>
                    <div className={styles.designationText}>
                        {item.designation}
                    </div>
                </div>
            </td>
            <td
                align="center"
            >
                <div className={styles.stockStyle}></div>
            </td>
            <td align="center">
                <div className={styles.amountStyle}>
                    <button className={styles.buttonStyle}>-</button>
                    <label className={styles.amountText}>{item.amount}</label>
                    <button className={styles.buttonStyle}>+</button>
                </div>
            </td>
            <td align="center">
                <div className={styles.featureCountStyle}>
                    {item.featureCount}
                </div>
            </td>
        </tr>
    );
};

export default ToolPackageListItem;
