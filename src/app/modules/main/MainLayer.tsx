'use client';

import React, {useCallback, useEffect, useRef} from 'react';
import * as PIXI from "pixi.js";
import {Spine} from "pixi-spine";

const MainLayer = () => {
    const canvasRef = useRef(null);
    let app: PIXI.Application;
    let road: PIXI.Sprite;
    let roadContainer: PIXI.Container = new PIXI.Container();
    let oldTime = 0;

    const initCanvas = useCallback(() => {
        if (!canvasRef.current) return;
        app = new PIXI.Application({ view: canvasRef.current, width: window.innerWidth, height: window.innerHeight });

        window.addEventListener('resize', () => {
            app.renderer.resize(window.innerWidth, window.innerHeight);
        });

        loadSpine();
        // @ts-ignore
        globalThis.__PIXI_APP__ = app;
    }, [canvasRef]);

    useEffect(() => {
        if (canvasRef.current) {
            initCanvas();
        }
    }, [canvasRef, initCanvas]);

    const loadSpine = async () => {
        await PIXI.Assets.load("/images/road_compressed.png").then((resource) => {
            console.log(resource);
            road = new PIXI.Sprite(resource);
            road.transform.scale.set(window.innerHeight / road.height);
            const road2 = new PIXI.Sprite(resource);
            road2.transform.scale.set(road.transform.scale.x);
            road2.transform.position.x = road.width;
            roadContainer.addChild(road);
            roadContainer.addChild(road2);

            app.stage.addChild(roadContainer);

            const anim = () => {
                requestAnimationFrame((time) => {
                    roadContainer.transform.position.x = -1*(time - oldTime) / 5;

                    if (roadContainer.transform.position.x < -road.width) {
                        oldTime = time;
                    }

                    app.render();
                    anim();
                })
            }
            anim();
        });
        PIXI.Assets.load("/spine/bus/skeleton.json").then((resource) => {
            console.log(resource);
            const animation = new Spine(resource.spineData);
            animation.x = 320;
            animation.y = app.renderer.height - 190;
            animation.scale.set(0.25);
            app.stage.addChild(animation);

            // // add the animation to the scene and render...
            // app.stage.addChild(animation);

            if (animation.state.hasAnimation('drive')) {
                // run forever, little boy!
                animation.state.setAnimation(0, 'drive', true);
                // dont run too fast
                animation.state.timeScale = 1;
                // update yourself
                animation.autoUpdate = true;
            }
        });
    }

    return (
        <canvas id="pixi-canvas" ref={canvasRef}/>
    );
};

export default MainLayer;
