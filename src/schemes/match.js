const MatchScheme = {
  title: 'match scheme',
  version: 0,
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    person_id: {
      type: 'string',
    },
    date: {
      type: 'string',
    },
    last_activity_date: {
      type: 'string',
    },
    is_new: {
      type: 'number',
    },
    is_boost_match: {
      type: 'number',
    },
    is_super_like: {
      type: 'number',
    },
    participants: {
      type: 'array',
    },
  },
};

export default MatchScheme;
