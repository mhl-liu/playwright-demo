// import fs from 'fs';
// import path from 'path';

// export class Logger {
//     constructor(filename = 'test.log') {
//         const logDir = path.resolve('logs');
//         if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
//         this.logFile = path.join(logDir, filename);
//     }

//     log(level, message) {
//         const time = new Date().toISOString();
//         const line = `[${time}] [${level.toUpperCase()}] ${message}`;
//         console.log(line);
//         fs.appendFileSync(this.logFile, line + '\n');
//     }

//     info(msg) { this.log('info', msg); }
//     warn(msg) { this.log('warn', msg); }
//     error(msg) { this.log('error', msg); }
// }



import winston from 'winston';
import path from 'path';
import fs from 'fs';

const logDir = 'logs';
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(info => `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`)
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: path.join(logDir, 'test.log') })
    ]
});

