import * as PIXI from "pixi.js";
import { Spine } from "pixi-spine";
import MainStore from "@/app/modules/store/MainStore";

class MainView {
    public symbol: PIXI.Container = new PIXI.Container();
    private road: PIXI.Sprite | null = null;
    private roadAssist: PIXI.Sprite[] = [];
    private roadHeight = 0;
    private roadContainer: PIXI.Container = new PIXI.Container();
    private busHeight = 0;
    private busWidth = 0;
    private bus: Spine | null = null;
    private oldTime = 0;
    private isDriving = false;

    constructor() {
        this.symbol.name = "MainView";
        this.load().then(() => {
            this.idle();
            MainStore.getInstance().events.on(
                "Place:setViewState",
                this.setViewState
            );
        });
    }

    private async load() {
        await PIXI.Assets.load("/images/road_5.png").then(resource => {
            const road = (this.road = new PIXI.Sprite(resource));
            this.roadHeight = road.height;
            this.roadContainer.addChild(road);

            this.symbol.addChild(this.roadContainer);
        });
        await PIXI.Assets.load("/spine/bus/skeleton.json").then(resource => {
            const animation = (this.bus = new Spine(resource.spineData));
            this.busHeight = animation.height;
            this.busWidth = animation.width;

            this.symbol.addChild(animation);
        });
        MainStore.getInstance().events.emit("MainLayer:Load");
    }

    private idle = () => {
        const animation = this.bus;
        if (!animation) return;
        if (animation.state.hasAnimation("idle")) {
            animation.state.setAnimation(0, "idle", true);
            animation.state.timeScale = 1;
            animation.autoUpdate = true;
        }
    };

    private drive = () => {
        const animation = this.bus;
        if (!animation) return;
        if (animation.state.hasAnimation("drive")) {
            animation.state.setAnimation(0, "drive", true);
            animation.state.timeScale = 1;
            animation.autoUpdate = true;
        }
    };

    public update(time: number) {
        const { road, roadContainer, oldTime, isDriving } = this;
        if (!road || !isDriving) return;
        roadContainer.transform.position.x = (-1 * (time - oldTime)) / 5;

        if (roadContainer.transform.position.x < -road.width) {
            this.oldTime = time;
        }
    }

    public resize(w: number, h: number) {
        const { road, bus } = this;
        if (!road || !bus) return;
        road.transform.scale.set(h / this.roadHeight);
        const busScale = Math.min(
            h / 3 / this.busHeight,
            w / 1.2 / this.busWidth
        );
        bus.scale.set(busScale);
        bus.y = h - bus.height * 0.8;
        bus.x = bus.width / 2;

        MainStore.getInstance().events.emit(
            "MainLayer:BusSize",
            bus.width,
            bus.height
        );

        this.fillRoad(w);
        this.roadAssist.forEach((sprite, i) => {
            sprite.transform.scale.set(h / this.roadHeight);
            sprite.x = (i + 1) * road.width;
        });
    }

    fillRoad(width: number) {
        const { road, roadContainer, roadAssist } = this;
        if (!road) return;

        const roadWidth = road.width;
        const roadCount = Math.ceil(width / roadWidth) + 1;
        for (let i = 1; i < roadCount; i++) {
            if (!roadAssist[i]) {
                const sprite = new PIXI.Sprite(road.texture);
                sprite.x = i * roadWidth;
                sprite.scale.set(road.transform.scale.x);
                roadAssist.push(sprite);
                roadContainer.addChild(sprite);
            }
        }
    }

    setViewState = (state: "hidden" | "intro" | "full") => {
        switch (state) {
            case "hidden":
                this.isDriving = true;
                this.drive();
                break;
            case "intro":
                this.isDriving = true;
                this.drive();
                break;
            case "full":
                this.isDriving = false;
                this.idle();
                break;
        }
    };

    public destroy() {
        MainStore.getInstance().events.off(
            "Place:setViewState",
            this.setViewState
        );
        this.symbol.destroy();
    }
}

export default MainView;
