import { User } from '../models/user.model.js'
import userService from './user.service.js'
import { ApiError } from '../utils/index.js'
import { ROLE } from '../utils/constants.js'

const generateAccessAndRefreshTokens = async (user) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    // skips required fields
    await user.save({ validateBeforeSave: false });

    return {accessToken, refreshToken};
  } catch (error) {
    throw new ApiError(500, "Something went wrong!");
  }
}

const login = async (email, password) => {
  if(!email?.trim() || !password?.trim()) {
    throw new ApiError(400, 'All fileds are required!')
  }

  const existingUser = await User.findOne({email})
  if(!existingUser) {
    throw new ApiError(404, 'User not found!')
  }

  const isPasswordCorrect = existingUser.isPasswordCorrect(password)
  if(!isPasswordCorrect) {
    throw new ApiError(401, 'Wrong credentials!')
  }

  const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(existingUser)

  return {user: existingUser, accessToken, refreshToken}
}

const register = async (name, email, role, password) => {
  if(!name?.trim() || !email?.trim() || !role?.trim() || !password?.trim()) {
    throw new ApiError(400, 'All fields are required!')
  }

  if(!Object.values(ROLE).includes(role)) {
    throw new ApiError(
      400,
      'Invalid role!\nRole can be one of these: admin, organiser or participant'
    )
  }

  const user = await userService.store(name, email, role, password)

  return user
}

const logout = async (id) => {
  User.findByIdAndUpdate(
    id,
    {
      $unset: {
          refreshToken: 1
      }
    },
    {
      new: true
    }
  );
}


export default {
  login,
  logout,
  register
}