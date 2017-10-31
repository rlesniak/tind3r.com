import React, { Component } from 'react';
import { hoistStatics, wrapDisplayName } from 'recompose';

export default function withHotkeys(handlers, useCapture = false) {
  return hoistStatics(BaseComponent =>
    class WithHotkeys extends Component {
      displayName = wrapDisplayName(BaseComponent, 'withHotkeys');

      componentDidMount() {
        this.updateEventListener(this.props);
      }

      componentWillUpdate(props) {
        this.updateEventListener(props);
      }

      componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyDown, useCapture);
      }

      updateEventListener(props) {
        if (props.allowHotkeys) {
          window.addEventListener('keydown', this.handleKeyDown, useCapture);
        } else {
          window.removeEventListener('keydown', this.handleKeyDown, useCapture);
        }
      }

      handleKeyDown = (event) => {
        const handler = handlers[event.keyCode];

        if (!handler) {
          return;
        }

        const handlerWithProps = Reflect.apply(handler, this, [this.props]);

        if (!handlerWithProps) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        Reflect.apply(handlerWithProps, this, [event]);
      };

      render() {
        return <BaseComponent {...this.props} />;
      }
    },
  );
}
