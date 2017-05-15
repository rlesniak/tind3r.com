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

    return Promise.resolve(data);
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function superlike(id: string): Object {
  try {
    const { data } = await API.post(`/like/${id}/super`);

    return Promise.resolve(data);
  } catch (e) {
    return Promise.reject(e);
  }
}
