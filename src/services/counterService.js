// @flow

type HandlerType = () => void;

type SubscriberType = {
  handler: HandlerType,
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

  const createSubscriber = (subscriber: SubscriberType) => {
    if (!isSubscriberExist(subscriber.handler)) {
      subscribers.push(subscriber);
      start();
    }
  };

  const start = () => {
    if (!interval) {
      interval = setInterval(() => {
        subscribers.forEach(sub => {
          sub.handler(interval);
        });
      }, 1000);
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

  const isSubscriberExist = (handler: HandlerType): boolean => !!subscribers.find(sub => sub.handler === handler);

  return {
    createSubscriber,
    unsubscribe,
    start,
    stop,
  };
};

export default counter();
