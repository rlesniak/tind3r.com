```
const BrowserRouter = require('react-router-dom').BrowserRouter;

const person = {
  _id: 1,
  isLoading: false,
  full_name: 'Rafal L',
};
  <BrowserRouter>
    <NavBar
      unreadCount={0}
      currentPerson={person}
    />
  </BrowserRouter>
```
