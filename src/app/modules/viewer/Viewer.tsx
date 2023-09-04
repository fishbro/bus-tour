"use client";

import React, { Component } from "react";
import MainLayer from "@/app/modules/main/MainLayer";
import Place, { PlaceDesc } from "@/app/modules/place/Place";
import styles from "./viewer.module.scss";
import MainStore from "@/app/modules/store/MainStore";

const placesConf: PlaceDesc[] = [
    {
        title: "Welcome!"
    },
    {
        title: "Traditional village",
        descTitle: "Lorem ipsum dolor sit amet",
        text:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n" +
            "Donec euismod, nisl eget aliquam ultricies, nunc nisl\n" +
            "ultricies nunc, eget aliquam nisl nisl eget nisl. Donec\n" +
            "euismod, nisl eget aliquam ultricies, nunc nisl\n" +
            "ultricies nunc, eget aliquam nisl nisl eget nisl.",
        photos: [
            "https://picsum.photos/640/480",
            "https://picsum.photos/640/481",
            "https://picsum.photos/640/482",
            "https://picsum.photos/640/483",
            "https://picsum.photos/640/484",
            "https://picsum.photos/640/485"
        ]
    },
    {
        title: "Old city",
        descTitle: "Lorem ipsum dolor sit amet",
        text:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n" +
            "Donec euismod, nisl eget aliquam ultricies, nunc nisl\n" +
            "ultricies nunc, eget aliquam nisl nisl eget nisl. Donec\n" +
            "euismod, nisl eget aliquam ultricies, nunc nisl\n" +
            "ultricies nunc, eget aliquam nisl nisl eget nisl.",
        photos: [
            "https://picsum.photos/640/486",
            "https://picsum.photos/640/487",
            "https://picsum.photos/640/488",
            "https://picsum.photos/640/489",
            "https://picsum.photos/640/490",
            "https://picsum.photos/640/491"
        ]
    }
];
class Viewer extends Component<any, any> {
    timer: NodeJS.Timeout | null = null;

    constructor(props: any) {
        super(props);
        this.state = {
            curPlace: 0
        };
    }

    componentDidMount() {
        MainStore.getInstance().events.on("MainLayer:Load", this.playSequence);
    }

    componentWillUnmount() {
        MainStore.getInstance().events.off("MainLayer:Load", this.playSequence);
    }

    playSequence = () => {
        MainStore.getInstance().events.emit("Place:setViewState", "intro");

        this.timer = setTimeout(() => {
            console.log("Place: showDescription");
            MainStore.getInstance().events.emit("Place:setViewState", "full");
        }, 1000);
    };

    onNext = () => {
        const { curPlace } = this.state;
        MainStore.getInstance().events.emit("Place:setViewState", "hidden");
        this.timer = setTimeout(() => {
            this.setState({ curPlace: (curPlace + 1) % placesConf.length });
            this.playSequence();
        }, 1000);
    };

    onPrev = () => {
        const { curPlace } = this.state;
        MainStore.getInstance().events.emit("Place:setViewState", "hidden");
        this.timer = setTimeout(() => {
            this.setState({
                curPlace: (curPlace - 1 + placesConf.length) % placesConf.length
            });
            this.playSequence();
        }, 1000);
    };

    render() {
        const { curPlace } = this.state;

        return (
            <>
                <MainLayer />
                <Place place={placesConf[curPlace]} />
                <div
                    className={`${styles.arrow} ${styles.arrow__prev}`}
                    onClick={this.onPrev}
                >
                    Prev
                </div>
                <div
                    className={`${styles.arrow} ${styles.arrow__next}`}
                    onClick={this.onNext}
                >
                    Next
                </div>
            </>
        );
    }
}

export default Viewer;
