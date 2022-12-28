const styles = [
    `background: #14787e`,
    `border-radius: 0.5rm`,
    `color: white`,
    `font-weight: bold`,
    `padding: 2px 0.5em`,
];

const LOG_PRE = [`%ceposter@web${Date.now()}`, styles.join(';')];

const logger = {
    info(...args: any) {
        console.info(...LOG_PRE, ...args);
    },
    log(...args: any) {
        console.log(...LOG_PRE, ...args);
    },
    warn(...args: any) {
        console.warn(...LOG_PRE, ...args);
    },
    error(...args: any) {
        console.error(...LOG_PRE, ...args);
    },
    json(val: any) {
        console.log(JSON.stringify(val, null, 2));
    },
    big(...args: any) {
        console.log('-------');
        console.log('');
        console.log(...args);
        console.log('');
        console.log('-------');
    },
};

export default logger;
