import { ApiResponse, ApiError } from './index.js'

export const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise
      .resolve(requestHandler(req, res, next))
      .catch((err) => {
        if (err instanceof ApiError) {
          res
            .status(err.statusCode)
            .json(new ApiResponse(err.statusCode, err.error, err.message))
        } else {
          res
            .status(500)
            .json(new ApiResponse(500, {}, 'Internal Server Error!'))
        }
        next(err)
      })
    }
}