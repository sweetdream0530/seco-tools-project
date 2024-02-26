import React from 'react';
import styles from './HeaderComponent.scss';

const HeaderComponent = () => {
    return (
        <div className={styles.container}>
            <img src="/assets/images/logo.png" className={styles.logo} />
            <span className={styles.text}>PreM</span>
            <button className={styles.menuButton}>
                <img src="/assets/images/menu.png" />
            </button>
        </div>
    );
};

export default HeaderComponent;