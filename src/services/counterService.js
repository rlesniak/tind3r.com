// @flow

import forEach from 'lodash/forEach';

type HandlerType = () => any;

type SubscriberType = {
  handler: HandlerType,
  isBusyHandler?: () => boolean,
  delay?: number,
}

type IntervalsType = {
  subscribers: Array<SubscriberType>,
  intervalId: number,
}

type CounterType = {
  subscribe: (subscriber: SubscriberType) => void,
  unsubscribe: (handler: HandlerType) => void,
  stop: () => void,
};

const DEFAULT_DELAY = 1000;

const counter = (): CounterType => {
  let intervals: { [key: number]: IntervalsType } = {};

  const isIntervalExist = (delay: number): boolean => (
    intervals[delay] && intervals[delay].intervalId !== 0
  );

  const start = (delay: number) => {
    if (!isIntervalExist(delay)) {
      intervals[delay].intervalId = setInterval(() => {
        intervals[delay].subscribers.forEach(sub => {
          if ((sub.isBusyHandler && !sub.isBusyHandler()) || !sub.isBusyHandler) {
            sub.handler(delay);
          }
        });
      }, delay);
    }
  };

  const createInterval = (subscriber: SubscriberType) => {
    const delay = subscriber.delay || DEFAULT_DELAY;

    if (!intervals[delay]) {
      intervals[delay] = { subscribers: [], intervalId: 0 };
    }
  };

  const removeInterval = (key: number) => {
    clearInterval(intervals[key].intervalId);
    delete intervals[key];
  };

  const stop = () => {
    forEach(intervals, key => removeInterval(key));

    intervals = {};
  };

  const subscribe = (subscriber: SubscriberType) => {
    const delay = subscriber.delay || DEFAULT_DELAY;
    createInterval(subscriber);

    intervals[delay].subscribers.push(subscriber);
    start(delay);
  };

  const unsubscribe = (handler: HandlerType) => {
    forEach(intervals, (val, key) => {
      intervals[key].subscribers = intervals[key].subscribers.filter(sub => sub.handler !== handler);

      if (intervals[key].subscribers.length === 0) {
        removeInterval(key);
      }
    });
  };

  return {
    subscribe,
    unsubscribe,
    stop,
  };
};

export default counter();
