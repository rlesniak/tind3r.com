const MessageScheme = {
  title: 'message scheme',
  version: 0,
  type: 'object',
  properties: {
    sender_id: {
      type: 'string',
    },
    match_id: {
      type: 'string',
    },
    body: {
      type: 'string',
    },
    date: {
      type: 'string',
    },
  },
};

export default MessageScheme;
