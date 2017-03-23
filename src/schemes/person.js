const PersonScheme = {
  title: 'person schema',
  version: 0,
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    connection_count: {
      type: 'array',
    },
    common_friends: {
      type: 'array',
    },
    bio: {
      type: 'string',
    },
    birth_date: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    ping_time: {
      type: 'string',
    },
    photos: {
      type: 'array',
    },
    schools: {
      type: 'array',
    },
    gender: {
      type: 'number',
    },
    distance_mi: {
      type: 'number',
    },
  },
};

export default PersonScheme;
