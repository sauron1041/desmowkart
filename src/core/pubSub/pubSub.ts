// // import { EventEmitter } from 'events';

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


import EventEmitter from 'events';

class PubSub extends EventEmitter {
    constructor() {
        super();
        console.log('PubSub module loaded');
    }
}

const eventEmitterInstance = new PubSub();

export default eventEmitterInstance;
