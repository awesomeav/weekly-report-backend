import mongoose from 'mongoose'
import crypto from 'crypto'
import { v1 as uuidv1 } from 'uuid'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: process.env.EMPLOYEE_ROLE,
    },
    about: {
      type: String,
      required: true,
      default: '',
    },
    project: {
      type: String,
      required: true,
      default: [],
    },
    // username: {
    //   type: String,
    //   unique: true,
    //   requried: true,
    // },
    salt: String,
    hashed_password: {
      type: String,
      required: true,
    },
    date_of_join: {
      type: Date,
      required: true,
      // default: Date.now,
    },
    department: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

// virtual field
userSchema
  .virtual('password')
  .set(function (password) {
    this._password = password
    this.salt = uuidv1()
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function () {
    return this._password
  })

userSchema.methods = {
  matchPassword: function (password) {
    return this.encryptPassword(password) === this.hashed_password
  },

  encryptPassword: function (password) {
    if (!password) return ''
    try {
      return crypto.createHmac('sha1', this.salt).update(password).digest('hex')
    } catch (error) {
      return ''
    }
  },
}

const User = mongoose.model('User', userSchema)
export default User
