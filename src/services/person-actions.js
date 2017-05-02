// @flow

import API from 'utils/api';

export async function pass(id: string): Object {
  try {
    const { data } = await API.get(`/pass/${id}`);

    return Promise.resolve(data);
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function like(id: string): Object {
  try {
    const { data } = await API.get(`/like/${id}`);

    if (data.likes_remaining === 0) {
      if (data.rate_limited_until) {
        // ls.set({ likeExpiration: data.rate_limited_until })
        return Promise.reject({ error: 'limit', resetsAt: data.rate_limited_until });
      }
    }

    return Promise.resolve(data);
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function superlike(id: string): Object {
  try {
    const { data } = await API.post(`/like/${id}/super`);

    if (!data.limit_exceeded) {
      // ls.set({ superLikeExpiration: data.super_likes.resets_at })
      Promise.reject({ error: 'limit', resetsAt: data.super_likes.resets_at });
    }

    return Promise.resolve(data);
  } catch (e) {
    return Promise.reject(e);
  }
}
