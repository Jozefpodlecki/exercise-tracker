import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const exerciseUsers = new Schema ({
  username: {
    type: String, 
    required: true,
    unique: true,
    maxlength: [20, 'username too long']
  },
});

export default mongoose.model('exerciseUsers', exerciseUsers);