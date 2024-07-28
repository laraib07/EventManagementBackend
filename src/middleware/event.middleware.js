import { asyncHandler, ApiError } from '../utils/index.js'
import { PERMISSIONS, ROLE } from '../utils/constants.js'
import eventService from '../services/event.service.js'

const checkEventAuth = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  if(!id) {
    throw new ApiError(400, 'Missing id parameter!')
  }

  const event = await eventService.getById(id)
  if(!event) {
    throw new ApiError(404, 'Not Found!')
  }

  if(
    !( req.user._id === event.organiser.toString()
    || req.permissions.includes(PERMISSIONS.ADMIN))
  ) {
    throw new ApiError(401, 'Unauthorized access!')
  }

  req.event = event
  next()
})

const checkEventDisenrollAuth = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  if(!id) {
    throw new ApiError(400, 'Missing id parameter!')
  }

  const event = await eventService.getById(id)
  if(!event) {
    throw new ApiError(404, 'Not Found!')
  }

  // admin can disenroll any user from any event
  // organiser can disenroll any user from his events
  if(req.user.role === ROLE.ORGANISER
    && !(req.user._id === event.organiser.toString())
  ) {
    throw new ApiError(401, 'Unauthorized access!')
  }
  // user can only disenroll themselve if they are enrolled
  if(req.user.role === ROLE.PARTICIPANT
    && !event.attendees.includes(req.user._id)
  ) {
    throw new ApiError(403, 'User not Enrolled')
  }

  req.event = event
  req.attendee = (req.user.role === ROLE.PARTICIPANT)
    ? req.user._id
    : req.body?.userId
  next()
})

export {
  checkEventAuth,
  checkEventDisenrollAuth
}