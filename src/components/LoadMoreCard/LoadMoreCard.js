// @flow

import React from 'react';
import { observer } from 'mobx-react';
import cx from 'classnames';
import noop from 'lodash/noop';

import './LoadMoreCard.scss';

type LoadMoreCardType = {
  loading?: boolean,
  onClick: () => void,
};

const LoadMoreCard = ({
  loading, onClick,
}: LoadMoreCardType) => (
  <div
    className={cx('load-more-card', { 'load-more-card--loading': loading })}
    onClick={loading ? noop : onClick}
  >
    {
      loading ? 'Loading...' : 'Click to load more'
    }
  </div>
);

export default observer(LoadMoreCard);
