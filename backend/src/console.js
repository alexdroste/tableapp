"use strict";

const config = require('./config');
const chalk = require('chalk');


function labelColorizer(options) {
    return (inp) => {
        const label = inp.slice(options.labelPrefix.length, -options.labelSuffix.length).toLowerCase();
        return typeof options.colorFuncs[label] === 'function' ? options.colorFuncs[label](inp) : inp;
    };
}


const unpatchedLog = console.log;


console.debug = function debug() {
    unpatchedLog.apply(console, arguments);
}


// log method produces [INFO] label by passing call to info method
console.log = function info() {
    console.info.apply(console, arguments);
}


require('console-stamp')(console, {
    pattern: 'dd/mm/yyyy HH:MM:ss.l',
    level: config.loglevel,
    extend: {
        debug: 4,
    },
    include: ["debug", "info", "warn", "error", "assert"],
    colors: {
        label: labelColorizer({
            labelPrefix: "[",
            labelSuffix: "]",
            colorFuncs: {
                debug: chalk.blue,
                info: chalk.green,
                warn: chalk.yellow,
                assert: chalk.magenta,
                error: chalk.red,
            },
        }),
    },
});
