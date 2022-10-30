import { Handler } from '.';

class GuidelineHandler {
    handler: Handler;

    constructor(handler: Handler) {
        this.handler = handler;
        this.init();
    }

    public init() {}
}

export default GuidelineHandler;
