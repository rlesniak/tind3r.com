import './NotFound.scss';

import React from 'react';
import {
  Link,
} from 'react-router-dom';

const NotFound = () => (
  <div className="not-found">
    <span>
      <div className="not-found__icon"><i className="fa fa-medkit" /></div>
      Not Found
    </span>
  </div>
);

export default NotFound;
