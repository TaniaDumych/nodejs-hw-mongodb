import { Schema, model } from 'mongoose';

const contactSchema = new Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  favorite: { type: Boolean, default: false },
  
  
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Contact = model('Contact', contactSchema);
export default Contact;
