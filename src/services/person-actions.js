import API from 'Utils/api';
import Database from 'Utils/database';


export async function pass(id: string): Object {
  try {
    const { data } = await API.get(`/pass/${id}`);

    Database.createAction(id, 'pass');

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
    } else {
      Database.createAction(id, 'like');

      if (data.match) {
        Database.createMatch(id, data.match)
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
      Promise.reject({ error: 'limit', resetsAt: data.super_likes.resets_at })
    }

    Database.createAction(id, 'superlike');

    if (data.match) {
      Database.createMatch(id, data.match);
    }

    return Promise.resolve(data);
  } catch (e) {
    return Promise.reject(e);
  }
}