function nowWithoutTimezone() {
    const d = new Date();
    const t = d.toString().substring(0, 24);
    let ms = '000' + d.getMilliseconds();
    return `${t}.${ms.substring(ms.length - 3)}`;
}

export function log(...args: any) {
    Function.prototype.call.call(
        console.log,
        console,
        `${nowWithoutTimezone()} ${args.toString()}`
    );
}
