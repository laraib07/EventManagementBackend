import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mongoose, { Schema } from 'mongoose'
import { ROLE } from '../utils/constants.js'

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(ROLE),
      default: ROLE.PARTICIPANT
    },
    refreshToken: { type: String },
  },
  { timestamps: true }
)

userSchema.pre('save', async function (next) {
  if(!this.isModified('password')) {
    return next()
  }
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

userSchema.methods.isPasswordCorrect = async function(password) {
  return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  );
}

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  );
}

export const User = mongoose.model('User', userSchema);