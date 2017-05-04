// @flow

type HandlerType = () => any;

type SubscriberType = {
  handler: HandlerType,
  isBusyHandler?: () => boolean,
}

type CounterType = {
  createSubscriber: (handler: SubscriberType) => void,
  unsubscribe: (handler: HandlerType) => void,
  start: () => void,
  stop: () => void,
};

const counter = (): CounterType => {
  let subscribers: Array<SubscriberType> = [];
  let interval: number;

  const start = () => {
    if (!interval) {
      interval = setInterval(() => {
        subscribers.forEach(sub => {
          if ((sub.isBusyHandler && !sub.isBusyHandler()) || !this.isBusyHandler) {
            sub.handler();
          }
        });
      }, 1000);
    }
  };

  const isSubscriberExist = (handler: HandlerType): boolean => !!subscribers.find(sub => sub.handler === handler);

  const createSubscriber = (subscriber: SubscriberType) => {
    if (!isSubscriberExist(subscriber.handler)) {
      subscribers.push(subscriber);
      start();
    }
  };

  const stop = () => {
    clearInterval(interval);
    subscribers = [];
    interval = 0;
  };

  const unsubscribe = (handler: HandlerType) => {
    subscribers = subscribers.filter(sub => sub.handler !== handler);

    if (subscribers.length === 0) {
      stop();
    }
  };

  return {
    createSubscriber,
    unsubscribe,
    start,
    stop,
  };
};

export default counter();
