"use strict";
// // import { EventEmitter } from 'events';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// // const eventEmitter = new EventEmitter();
// // export default eventEmitter;
// import { EventEmitter } from 'events';
// const eventEmitter = new EventEmitter();
// export default eventEmitter;
// import EventEmitter from 'events';
// class PubSub extends EventEmitter { }
// const eventEmitterInstance = new PubSub();
// export default eventEmitterInstance;
// import EventEmitter from 'events';
// console.log('PubSub module loaded');
// class PubSub extends EventEmitter { }
// const eventEmitterInstance = new PubSub();
// // Sử dụng Singleton
// const instance = (() => eventEmitterInstance)();
// export default instance;
const events_1 = __importDefault(require("events"));
class PubSub extends events_1.default {
    constructor() {
        super();
        console.log('PubSub module loaded');
    }
}
const eventEmitterInstance = new PubSub();
exports.default = eventEmitterInstance;
//# sourceMappingURL=pubSub.js.map