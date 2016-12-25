export default (obj) => {
  return {
    _id: obj._id,
    userId: obj.person._id,
    date: new Date(obj.created_date),
    lastActivityDate: new Date(obj.last_activity_date),
    isNew: 1,
    isBoostMatch: obj.is_boost_match ? 1 : 0,
    isSuperLike: obj.is_super_like ? 1 : 0,
    participants: obj.participants,
  }
}
