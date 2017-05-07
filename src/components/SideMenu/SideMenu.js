import './SideMenu.scss';

import React from 'react';
import cx from 'classnames';
import { compose, withState } from 'recompose';

type PropsType = {
  children: any,
  className: ?any,
};

export const Separator = () => (
  <div className="side-menu__separator" />
);

export const Right = (props: PropsType) => (
  <div className="side-menu__right">
    {props.children}
  </div>
);

type ItemPropsType = PropsType & {
  active: boolean,
  onClick: () => void,
  rightText: string,
  asAction?: boolean,
  disabled?: boolean,
};

export const Item = (props: ItemPropsType) => (
  <div
    className={cx('side-menu__item', props.className, {
      'side-menu__item--active': props.active,
      'side-menu__item--action': props.asAction,
      'side-menu__item--disabled': props.disabled,
    })}
    onClick={props.onClick}
  >
    {props.children}

    <div className="side-menu__right-text">
      {props.rightText}
    </div>
  </div>
);

const enhance = compose(
  withState('toggled', 'toggle', false),
);

type SideMenuPropsType = PropsType | {
  title: string,
  toggle: boolean,
  toggled: (state: boolean) => void,
};

export default enhance(({ children, title, toggle, toggled }: SideMenuPropsType) => (
  <div className={cx('side-menu', { 'side-menu--hidden': toggled })}>
    <h1 className="side-menu__title">
      <div
        className="side-menu__title-toogle"
        onClick={() => toggle(state => !state)}
      >
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
  </div>
  ));
