// @flow

import React from 'react';
import { compose, withState, withHandlers } from 'recompose';
import cx from 'classnames';

import { MatchStore } from 'stores/MatchStore';

import './MatchFilters.scss';

type PropsType = {
  setValue: (value: string) => void,
  matchStore: MatchStore,
}

const enhance = compose(
  withState('value', 'setValue', ({ matchStore }) => matchStore.filter),
  withHandlers({
    handleChange: ({ setValue, matchStore }: PropsType) => ({ target }: Event) => {
      if (target instanceof HTMLInputElement) {
        setValue(target.value);
        matchStore.setFilter(target.value);
      }
    },
  }),
);

const MatchFilters = ({ value, handleChange }) => (
  <div className={cx('match-filters')}>
    <input
      placeholder="Search"
      className="match-filters__input"
      value={value}
      onChange={handleChange}
    />
  </div>
);

export default enhance(MatchFilters);
