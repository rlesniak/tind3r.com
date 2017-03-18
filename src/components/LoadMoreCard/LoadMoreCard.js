import './LoadMoreCard.scss';

import React from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import noop from 'lodash/noop';

type LoadMoreCardType = {
  loading?: bollean,
  onClick: () => void,
};

const LoadMoreCard = ({
  loading, onClick
}) => (
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
