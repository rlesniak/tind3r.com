// @flow

import forEach from 'lodash/forEach';
import isFunction from 'lodash/isFunction';

type HandlerType = () => any;

type SubscriberType = {
  handler: HandlerType,
  isBusyHandler?: () => boolean,
  delay?: number,
  id?: string,
}

type IntervalsType = {
  subscribers: Array<SubscriberType>,
  intervalId: number,
}

type CounterType = {
  subscribe: (subscriber: SubscriberType) => void,
  unsubscribe: (handler: HandlerType | string) => void,
  stop: () => void,
};

const DEFAULT_DELAY = 1000;

const counter = (): CounterType => {
  let intervals: { [key: number]: IntervalsType } = {};

  const isIntervalExist = (delay: number): boolean => (
    intervals[delay] && intervals[delay].intervalId !== 0
  );

  const runSubscribers = (delay: number) => {
    intervals[delay].subscribers.forEach((sub) => {
      if ((sub.isBusyHandler && !sub.isBusyHandler()) || !sub.isBusyHandler) {
        sub.handler(delay);
      }
    });
  };

  const start = (delay: number) => {
    runSubscribers(delay);

    if (!isIntervalExist(delay)) {
      intervals[delay].intervalId = setInterval(() => {
        runSubscribers(delay);
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

  const unsubscribe = (handler: HandlerType | string) => {
    forEach(intervals, (val, key) => {
      intervals[key].subscribers = intervals[key].subscribers.filter((sub) => {
        if (!isFunction(handler)) {
          return sub.id !== handler;
        }

        return sub.handler !== handler;
      });

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
