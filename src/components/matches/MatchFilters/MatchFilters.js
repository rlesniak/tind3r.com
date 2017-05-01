import './MatchFilters.scss';

import React, { Component } from 'react';
import Slider from 'react-slick';
import { compose, withState, withHandlers } from 'recompose';
import cx from 'classnames';

import { MatchStore } from 'stores/MatchStore';

type PropsType = {
  matchStore: MatchStore,
}

const enhance = compose(
  withState('value', 'setValue', ''),
  withHandlers({
    handleChange: ({ setValue, matchStore }: PropsType) => (e: Event) => {
      setValue(e.target.value)
      matchStore.filter = e.target.value;
    }
  }),
)

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
