import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  jwtToken: { type: String, required: true }, 
  refreshToken: { type: String, required: true },
  jwtTokenValidUntil: { type: Date, required: true }, 
  refreshTokenValidUntil: { type: Date, required: true },
});

const Session = mongoose.model('Session', sessionSchema);
export default Session;