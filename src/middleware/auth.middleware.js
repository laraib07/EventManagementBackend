import jwt from 'jsonwebtoken'
import { asyncHandler, ApiError } from '../utils/index.js'
import { ROLE, PERMISSIONS, roleHavePermissions } from '../utils/constants.js'

const checkAuth = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken
    || req.header("Authorization")?.replace("Bearer ", "")
  if(!token) {
    throw new ApiError(401, 'Unauthorized Access!')
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    req.user = decodedToken
    req.permissions = roleHavePermissions.get(decodedToken.role)
  } catch(err) {
    if(err.name === 'TokenExpiredError') {
      // Issue new token using refreshToken
    }

    throw new ApiError(400, 'Invalid token!')
  }

  next()
})

const checkPermission = (permission) => asyncHandler(async (req, res, next) => {
  if(
    !( req.permissions.includes(permission)
    || req.permissions.includes(PERMISSIONS.ADMIN))
  ) {
    throw new ApiError(401, 'Unauthorized access!')
  }
  next()
})

export {
  checkAuth,
  checkPermission
}