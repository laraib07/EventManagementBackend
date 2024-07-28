import authService from '../services/auth.service.js'
import { asyncHandler, ApiError, ApiResponse } from '../utils/index.js'


const register = asyncHandler(async (req, res) => {
  const user = await authService.register(
    req.body.name,
    req.body.email,
    req.body.role,
    req.body.password
  )

  return res
    .status(201)
    .json(new ApiResponse(201, user, "User registered successfully!"))
})

const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(
    req.body.email,
    req.body.password
  )

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, user, "User logged in successfully!"))
})

const logout = asyncHandler(async (req, res) => {
    await authService.logout(req.user._id)

    const options = {
        httpOnly: true,
        secure: true
    };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out!"));
})

export {
  login,
  logout,
  register
}