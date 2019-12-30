import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const exercises = new Schema ({
  description: {
    type: String,
    required: true,
    maxlength: [20, 'description too long']
  },
  duration: {
    type: Number,
    required: true,
    min: [1, 'duration too short']
  },
  date: {
    type: Date,
    default: Date.now
  },
  username: String,
  userId: {
    type: String,
    ref: 'exerciseUsers',
    index: true
  }
});

exercises.pre('save', function(next) {

  mongoose.model('exerciseUsers').findById(this.userId, (err, user) => {
    if(err) {
      return next(err)
    }
    
    if(!user) {
      const err: any = new Error('unknown userId')
      err.status = 400
      return next(err)
    }
    
    this.username = user.username
    
    if(!this.date) {
      this.date = Date.now()
    }
    
    next();
    
  })
  
})

export default mongoose.model('exercises', exercises);