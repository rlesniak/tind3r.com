### Large card
```example
const BrowserRouter = require('react-router-dom').BrowserRouter;
const personMock = require('../../mocks/person').default;
const Person = require('../../models/Person').default;
initialState = { withInsta: false };

person = new Person(null, personMock);
person.bio = 'lore ispsim';

<BrowserRouter>
  <div>
    <PersonCardFull person={person} />
  </div>
</BrowserRouter>
```