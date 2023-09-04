"use client";

import React, { Component } from "react";
import styles from "./place.module.scss";
import MainStore from "@/app/modules/store/MainStore";

export type PlaceDesc = {
    title: string;
    descTitle?: string;
    text?: string;
    photos?: string[];
};

type IState = {
    place?: PlaceDesc;
    dimensions: React.CSSProperties;
    state: "hidden" | "intro" | "full";
};

class Place extends Component<{ place?: PlaceDesc }, IState> {
    constructor(props: { place?: PlaceDesc }) {
        super(props);

        this.state = {
            place: props.place,
            dimensions: {},
            state: "hidden"
        };
    }

    componentDidMount() {
        MainStore.getInstance().events.on("MainLayer:BusSize", this.setSize);
        MainStore.getInstance().events.on(
            "Place:setViewState",
            this.setViewState
        );
    }

    componentWillUnmount() {
        MainStore.getInstance().events.off("MainLayer:BusSize", this.setSize);
        MainStore.getInstance().events.off(
            "Place:setViewState",
            this.setViewState
        );
    }

    componentDidUpdate(
        prevProps: Readonly<{ place?: PlaceDesc }>,
        prevState: Readonly<{}>,
        snapshot?: any
    ) {
        if (prevProps.place !== this.props.place) {
            this.setState({ place: this.props.place });
        }
    }

    setViewState = (state: "hidden" | "intro" | "full") => {
        const { place } = this.props;
        if (
            place &&
            !(place.descTitle && place.text && place.photos) &&
            state === "full"
        )
            return;
        this.setState({ state });
    };

    setSize = (w: number, h: number) => {
        this.setState({
            dimensions: {
                width: w,
                height: `calc(95% - ${h}px)`
            }
        });
    };

    render() {
        const { dimensions, state, place } = this.state;
        if (!place) return null;

        const hasDesc = place.descTitle && place.text && place.photos;

        return (
            <div className={`${styles.place} ${styles[state]}`}>
                <div className={styles.place__intro} style={dimensions}>
                    {hasDesc ? (
                        <div className={styles.place__intro__phrase}>
                            The next stop is...
                        </div>
                    ) : null}
                    <div className={styles.place__intro__title}>
                        {place.title}
                    </div>
                </div>
                {hasDesc ? (
                    <div className={styles.place__description}>
                        <div className={styles.place__description__title}>
                            {place.descTitle}
                        </div>
                        <div className={styles.place__description__text}>
                            {place.text}
                        </div>
                        {place.photos ? (
                            <div className={styles.place__description__photos}>
                                {place.photos.map((photo, i) => (
                                    <div
                                        key={i}
                                        className={
                                            styles.place__description__photos__photo
                                        }
                                        style={{
                                            backgroundImage: `url(${photo})`
                                        }}
                                    />
                                ))}
                            </div>
                        ) : null}
                    </div>
                ) : null}
            </div>
        );
    }
}

export default Place;
