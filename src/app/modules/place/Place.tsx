"use client";

import React, { Component } from "react";
import styles from "./place.module.scss";

class Place extends Component<any, any> {
    render() {
        return (
            <div className={styles.place}>
                <div className={styles.place__intro}>
                    <div className={styles.place__intro__phrase}>
                        Our first stop is...
                    </div>
                    <div className={styles.place__intro__title}>
                        Traditional village
                    </div>
                </div>
                <div className={styles.place__description}>
                    <div className={styles.place__description__title}>
                        Lorem ipsum dolor sit amet
                    </div>
                    <div className={styles.place__description__text}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Donec euismod, nisl eget aliquam ultricies, nunc nisl
                        ultricies nunc, eget aliquam nisl nisl eget nisl. Donec
                        euismod, nisl eget aliquam ultricies, nunc nisl
                        ultricies nunc, eget aliquam nisl nisl eget nisl.
                    </div>
                    <div className={styles.place__description__photos}>
                        <div
                            className={styles.place__description__photos__photo}
                        />
                        <div
                            className={styles.place__description__photos__photo}
                        />
                        <div
                            className={styles.place__description__photos__photo}
                        />
                        <div
                            className={styles.place__description__photos__photo}
                        />
                        <div
                            className={styles.place__description__photos__photo}
                        />
                        <div
                            className={styles.place__description__photos__photo}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Place;
