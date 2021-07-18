import five from "johnny-five";
import CONFIG from "../config.js";
import { log } from "../log/log.js";

export default new Promise((accept, reject) => {
    const board = new five.Board({repl: false, debug: false, port: '/dev/ttyACM0'});

    board.on("close", function(event) {
        log.info('Board disconnected');
    });

    board.on("ready", () => {
        log.info('Board ready');
        accept(board);
    });

    board.on('error', err => {
        log.fatal(err);
        reject(err);
    });
})
