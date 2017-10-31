// @flow

import React from 'react';
import cx from 'classnames';
import { compose, withState, withHandlers } from 'recompose';

import LS from 'utils/localStorage';

import './SideMenu.scss';

type PropsType = {
  children: any,
  className?: string,
};

export const Separator = () => <div className="side-menu__separator" />;

export const Right = (props: PropsType) =>
  (<div className="side-menu__right">
    {props.children}
  </div>);

type ItemPropsType = PropsType & {
  active: boolean,
  onClick: () => void,
  rightText: string,
  asAction?: boolean,
  disabled?: boolean,
  asLink?: boolean,
};

export const Item = (props: ItemPropsType) =>
  (<div
    className={cx('side-menu__item', props.className, {
      'side-menu__item--active': props.active,
      'side-menu__item--action': props.asAction,
      'side-menu__item--disabled': props.disabled,
      'side-menu__item--link': props.asLink,
    })}
    onClick={props.onClick}
  >
    {props.children}

    <div className="side-menu__right-text">
      {props.rightText}
    </div>
  </div>);

const enhance = compose(
  withState('toggled', 'toggle', props => LS.get(['settings', 'sideBar', props.id], false)),
  withHandlers({
    handleSetToggle: props => () => {
      const state = !props.toggled;
      props.toggle(state);

      if (props.id) {
        LS.setSettings({
          sideBar: {
            ...LS.get(['settings', 'sideBar'], {}),
            [props.id]: state,
          },
        });
      }
    },
  }),
);

type SideMenuPropsType = PropsType | {
  title: string,
  id: string,
  toggled: boolean,
  handleSetToggle: () => void,
};

export default enhance(({ children, title, handleSetToggle, toggled }: SideMenuPropsType) =>
  (<div className={cx('side-menu', { 'side-menu--hidden': toggled })}>
    <h1 className="side-menu__title">
      <div className="side-menu__title-toogle" onClick={handleSetToggle}>
        <i
          className={cx('fa', {
            'fa-chevron-left': !toggled,
            'fa-chevron-right': toggled,
          })}
        />
      </div>
      <span>{title}</span>
    </h1>
    <div className="side-menu__items">
      {children}
    </div>
  </div>),
);
