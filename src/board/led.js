import pixel from "node-pixel";
import rgbHex from 'rgb-hex';
import Board from "./board.js";
import CONFIG from "../config.js";
import {log} from "../log/log.js";
import PQueue from 'p-queue';

export default function() {

    const queue = new PQueue({
        intervalCap: 1,
        interval: 50,
        concurrency: 1
    });
    let waveInterval;
    let fadeInterval;
    let flashInterval;

    const stripPromise = new Promise(async (accept, reject) => {
        const board = await Board;
        const strip = new pixel.Strip({
            board: board,
            controller: "FIRMATA",
            strips: [ {pin: 6, length: 60}, ],
            gamma: 3,
        });

        strip.on("ready", () => {
            log.info('Strip ready');
            return accept(strip);
        });
    });

    this.on = async function(inputR, inputG, inputB, reset = false) {
        if (reset) {
            await this.reset();
        }
        let strip = await stripPromise;
        return queue.add(() => {
            strip.color('#' + rgbHex(inputR, inputG, inputB));
            strip.show();
        });
    }

    this.flash = async function(inputR, inputG, inputB, interval = 500, limit = -1) {
        await this.reset();
        let isOn = false;
        let count =  0;
        flashInterval = setInterval(() => {
            isOn ? this.off() : this.on(inputR, inputG, inputB);
            isOn = !isOn;
            count++;
            if ((count / 2) >= limit && limit !== -1) {
                this.off(true);
            }
        }, interval);

        return Promise.resolve();
    }

    this.fade = async function(inputR, inputG, inputB, speedMs = 2000) {
        await this.reset();

        let intervalDelay = 50;
        let maxInput = Math.max(inputR, inputG, inputB);
        let numberOfColors = Math.round(speedMs / (intervalDelay * 2));
        let diffPerInput = Math.round(maxInput / numberOfColors);

        let colorList = [];
        for (let i = 0; i < numberOfColors; i++) {
            colorList.push('#' + rgbHex(
                Math.max(0, Math.round(inputR - (i * diffPerInput))),
                Math.max(0, Math.round(inputG - (i * diffPerInput))),
                Math.max(0, Math.round(inputB - (i * diffPerInput))),
            ));
        }
        colorList = [...colorList.reverse(), ...colorList.reverse()];
        console.log(colorList);
        let offset = 0;
        const strip = await stripPromise;
        fadeInterval = setInterval(() => {
            queue.add(() => {
                strip.color(colorList[offset % colorList.length]);
                strip.show();
            })
            offset++;
        }, intervalDelay);

        return Promise.resolve()
    }

    this.wave = async function(inputR, inputG, inputB, waves = 3) {
        await this.reset();

        let maxInput = Math.max(inputR, inputG, inputB);
        let ledsPerWave = Math.round(CONFIG.numStripLeds / waves);
        let diffPerInput = Math.round(maxInput / ledsPerWave);
        let colorList = [];
        for (let i = 0; i < ledsPerWave - 1; i++) {
            colorList.push('#' + rgbHex(
                Math.max(0, Math.round(inputR - (i * diffPerInput))),
                Math.max(0, Math.round(inputG - (i * diffPerInput))),
                Math.max(0, Math.round(inputB - (i * diffPerInput))),
            ));
        }
        colorList.push('#000000');

        const strip = await stripPromise;
        let offset = 0;
        waveInterval = setInterval(() => {
            queue.add(() => {
                for (let i = offset; i < CONFIG.numStripLeds + offset; i++) {
                    let color = colorList[i % ledsPerWave];
                    strip.pixel(i - offset).color(color);
                }
                strip.show();
            });
            offset++;
        }, 110);

        return Promise.resolve()
    }

    this.off = async function(reset = false) {
        if (reset) {
            await this.reset();
        }
        const strip = await stripPromise;
        return queue.add(() => {
            strip.color('#000000');
            strip.show();
        });
    }

    this.reset = async function() {
        queue.clear();
        if (waveInterval !== null) {
            clearInterval(waveInterval);
        }
        if (fadeInterval !== null) {
            clearInterval(fadeInterval);
        }
        if (flashInterval !== null) {
            clearInterval(flashInterval);
        }
        return new Promise(accept => {
            setInterval(() => accept(), 50);
        });
    }

    this.off();
}