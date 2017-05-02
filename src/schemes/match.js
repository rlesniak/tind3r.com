const MatchScheme = {
  title: 'match scheme',
  version: 0,
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    person: {
      type: 'string',
      ref: 'persons',
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
    messages: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          sender_id: {
            type: 'string',
          },
          body: {
            type: 'string',
          },
          date: {
            type: 'string',
          },
        },
      },
    },
  },
};

export default MatchScheme;
