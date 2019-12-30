import Exercises from '../models/exercise'
import Users from '../models/exerciseUser'
import * as mongoose from 'mongoose';

const UNIQUE_ERROR = 11000

const addExercise = (req, res, next) => {
  const { userId: userIdString, ...rest } = req.body;
  const userId = mongoose.Types.ObjectId(userIdString);
  
  Users.findById(userId, (err, user) => {
    if(err) {
      return next(err)
    }
    
    if(!user) {
      return next({
        status: 400,
        message: 'unknown _id'
      })
    }
    
    const exercise = new Exercises({
      userId,
      ...rest
    })
    exercise.username = user.username
    
    exercise.save((err, savedExercise) => {
      if(err) {
        return next(err)
      }
      
      savedExercise = savedExercise.toObject()
      
      delete savedExercise.__v
      savedExercise._id = savedExercise.userId
      
      delete savedExercise.userId
      savedExercise.date = (new Date(savedExercise.date)).toDateString()
      res.json(savedExercise)
    })
  })

}

const addUser = (req, res, next) => {
  const user = new Users(req.body)
  
  user.save((err, savedUser) => {
    if(err && err.code === UNIQUE_ERROR) {

      return next({
        status: 400,
        message: 'username already taken'
      })
    }
      
    res.json({
      username: savedUser.username,
      _id: savedUser._id
    })
  }) 
}

const getUsers = (req, res) => {
  Users.find({}, (err, data) => {
    res.json(data)
  })  
}

const getExercises = (req, res, next) => {
  const {
    from: fromString,
    to: toString,
    userId: userIdString,
    limit: limitString
  } = req.query;
  const from = new Date(fromString);
  const to = new Date(toString);
  const userId = mongoose.Types.ObjectId(userIdString);
  const limit = parseInt(limitString);
  
  Users.findById(userId, (err, user) => {
    if(err) {
      return next(err);
    }
    
    if(!user) {
      return next({
        status: 400,
        message: 'unknown userId'
      })
    }
    
    Exercises.find({
      userId: userIdString,
        date: {
          $lt: to.toString() != 'Invalid Date' ? to.getTime() : Date.now() ,
          $gt: from.toString() != 'Invalid Date' ? from.getTime() : 0
        }
      }, {
        __v: 0,
        _id: 0
      })
    .sort('-date')
    .limit(limit)
    .exec((err, exercises) => {
      if(err) {
        return next(err)
      }
      
      const out = {
          _id: userId,
          username: user.username,
          from : from.toString() != 'Invalid Date' ? from.toDateString() : undefined,
          to : to.toString() != 'Invalid Date' ? to.toDateString(): undefined,
          count: exercises.length,
          log: exercises.map(({description, duration, date}) => ({
            description,
            duration,
            date: date.toDateString()
          })
        )
      }

      res.json(out)
    })
  })
  
}

export default {
  addExercise,
  addUser,
  getUsers,
  getExercises
}