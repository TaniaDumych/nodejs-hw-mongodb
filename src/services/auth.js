import User from '../models/User.js';

export async function getUserByEmail(email) {
  return User.findOne({ email });
}

export async function createUser(userData) {
  const user = new User(userData);
  return user.save();
}
