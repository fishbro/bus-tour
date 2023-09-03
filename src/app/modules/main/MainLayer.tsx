'use client';

import React, {Component} from 'react';
import * as PIXI from "pixi.js";
import MainView from "@/app/modules/main/MainView";
import MainStore from "@/app/modules/store/MainStore";

class MainLayer extends Component<any, any>{
    private canvasRef: HTMLCanvasElement | null = null;
    private app: PIXI.Application | null = null;
    private view: MainView = new MainView();

    private resize = () => {
        if (!this.app) return;
        this.app.renderer.resize(window.innerWidth, window.innerHeight);
        this.view.resize(this.app.renderer.width, this.app.renderer.height);
    }

    componentDidMount() {
        if (!this.canvasRef) return;
        const app = this.app = new PIXI.Application({ view: this.canvasRef, width: window.innerWidth, height: window.innerHeight });
        // @ts-ignore
        globalThis.__PIXI_APP__ = app;

        app.stage.addChild(this.view.symbol);
        this.anim();

        window.addEventListener('resize', this.resize);
        MainStore.getInstance().events.on('MainLayer:Load', this.onLoad);
    }

    componentWillUnmount() {
        if (!this.app) return;
        this.app.destroy();
        this.view.destroy();

        window.removeEventListener('resize', this.resize);
        MainStore.getInstance().events.off('MainLayer:Load', this.onLoad);
    }

    private onLoad = () => {
        const app = this.app;
        if (!app) return;

        this.view.resize(app.renderer.width, app.renderer.height);
    }

    anim = () => {
        const app = this.app;
        requestAnimationFrame((time) => {
            if (!app) return;
            this.view.update(time);
            app.render();
            this.anim();
        })
    }

    render() {
        return (
            <canvas id="pixi-canvas" ref={(el) => this.canvasRef = el}/>
        );
    }
}

export default MainLayer;
