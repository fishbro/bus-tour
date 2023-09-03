import * as PIXI from "pixi.js";
import {Spine} from "pixi-spine";
import MainStore from "@/app/modules/store/MainStore";

class MainView {
    public symbol: PIXI.Container = new PIXI.Container();
    private road: PIXI.Sprite | null = null;
    private roadAssist: PIXI.Sprite[] = [];
    private roadHeight = 0;
    private roadContainer: PIXI.Container = new PIXI.Container();
    private busHeight = 0;
    private bus: Spine | null = null;
    private oldTime = 0;

    constructor() {
        this.symbol.name = "MainView";
        this.load().then(() => {
            this.init();
        });
    }

    private async load() {
        await PIXI.Assets.load("/images/road_5.png").then((resource) => {
            const road = this.road = new PIXI.Sprite(resource);
            this.roadHeight = road.height;
            this.roadContainer.addChild(road);

            this.symbol.addChild(this.roadContainer);
        });
        await PIXI.Assets.load("/spine/bus/skeleton.json").then((resource) => {
            const animation = this.bus = new Spine(resource.spineData);
            this.busHeight = animation.height;

            this.symbol.addChild(animation);
        });
        MainStore.getInstance().events.emit('MainLayer:Load');
    }

    private init() {
        const animation = this.bus;
        if (!animation) return;
        if (animation.state.hasAnimation('drive')) {
            animation.state.setAnimation(0, 'drive', true);
            animation.state.timeScale = 1;
            animation.autoUpdate = true;
        }
    }

    public update(time: number) {
        const {road, roadContainer, oldTime} = this;
        if (!road) return;
        roadContainer.transform.position.x = -1*(time - oldTime) / 5;

        if (roadContainer.transform.position.x < -road.width) {
            this.oldTime = time;
        }
    }

    public resize(w:number, h: number) {
        const {road, bus} = this;
        if (!road || !bus) return;
        road.transform.scale.set(h / this.roadHeight);
        bus.scale.set(h/this.busHeight/3);
        bus.y = h - bus.height * .9;
        bus.x = bus.width / 2;

        this.fillRoad(w);
        this.roadAssist.forEach((sprite, i) => {
            sprite.transform.scale.set(h / this.roadHeight);
            sprite.x = (i + 1) * road.width;
        });
    }

    fillRoad(width: number) {
        const {road, roadContainer, roadAssist} = this;
        if (!road) return;

        const roadWidth = road.width;
        const roadCount = Math.ceil(width / roadWidth) + 1;
        for (let i = 1; i < roadCount; i++) {
            if (!roadAssist[i]) {
                const sprite = new PIXI.Sprite(road.texture);
                sprite.x = i * roadWidth;
                sprite.scale.set(road.transform.scale.x)
                roadAssist.push(sprite);
                roadContainer.addChild(sprite);
            }
        }
    }

    public destroy() {
        this.symbol.destroy();
    }
}

export default MainView;
