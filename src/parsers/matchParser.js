export default input => ({
  _id: input._id,
  is_super_like: input.is_super_like,
  is_boost_match: input.is_boost_match,
  person_id: input.participants[0],
  last_activity_date: input.last_activity_date,
  created_date: input.created_date,
  is_new: input.is_new,
  super_liker: input.super_liker,
});
