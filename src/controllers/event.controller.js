import eventService from '../services/event.service.js'
import { asyncHandler, ApiResponse } from '../utils/index.js'

const add = asyncHandler(async (req, res) => {
  const event = await eventService.add(
    req.body?.title,
    req.body?.description,
    req.body?.date,
    req.body?.location,
    req?.user?._id
  )

  return res
    .status(201)
    .json(new ApiResponse(201, event, 'Event successfully created!'))
})

const cancel = asyncHandler(async (req, res) => {
  await eventService.cancel(req.event._id)

  return res
    .status(204)
    .json(new ApiResponse(204, {}, 'Event cancelled successfully!'))
})

const disenroll = asyncHandler(async (req, res) => {
  await eventService.disenroll(req.params.id, req.attendee)

  return res
    .status(204)
    .json(new ApiResponse(204, {}, 'Disenrolled successfully!'))
})

const enroll = asyncHandler(async (req, res) => {
  const event = await eventService.enroll(req.params.id, req.user._id)

  return res
    .status(201)
    .json(new ApiResponse(201, event, 'Successfully enrolled!'))
})

const getAll = asyncHandler(async (req, res) => {
  const events = await eventService.getAll()

  return res
    .status(200)
    .json(new ApiResponse(200, events, ''))
})

const getById = asyncHandler(async (req, res) => {
  const event = await eventService.getById(req.params.id)

  return res
    .status(200)
    .json(new ApiResponse(200, event, ''))
})

const getByOrganiser = asyncHandler(async (req, res) => {
  const events = await eventService.getByOrganiser(req.params.id)

  return res
    .status(200)
    .json(new ApiResponse(200, events, ''))
})

export {
  add,
  cancel,
  disenroll,
  enroll,
  getAll,
  getById,
  getByOrganiser
}