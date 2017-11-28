// @flow

import React from 'react';
import { compose, withStateHandlers, withHandlers, type HOC } from 'recompose';
import cx from 'classnames';

import { MatchStore } from 'stores/MatchStore';

import './MatchFilters.scss';

type PropsType = {
  matchStore: MatchStore,
};

const MatchFilters = ({ value, handleChange }) => (
  <div className={cx('match-filters')}>
    <input placeholder="Search" className="match-filters__input" value={value} onChange={handleChange} />
  </div>
);

const enhance: HOC<*, PropsType> = compose(
  withStateHandlers(({ matchStore }) => ({ value: matchStore.filter }), {
    setValue: () => value => ({
      value,
    }),
  }),
  withHandlers({
    handleChange: ({ setValue, matchStore }) => ({ target }: Event) => {
      if (target instanceof HTMLInputElement) {
        setValue(target.value);
        matchStore.setFilter(target.value);
      }
    },
  }),
);

export default enhance(MatchFilters);
