import mongoose from 'mongoose'
import { Event } from '../models/event.model.js'
import { ApiError } from '../utils/index.js'


const getById = async (id) => {
  return await Event.findById(id)
}

const getAll = async () => {
  return await Event.find()
}

const getByOrganiser = async (id) => {
  return await Event.find({ organiser: id})
}

const add = async (title, description, date, location, organiser) => {
  if(
    [title, description, date, location, organiser].some(field =>
      field?.trim() === ''
    )
  ) {
    throw new ApiError(400, 'All fileds are required!')
  }

  const existingEvent = await Event.findOne({title, date, location})
  if(existingEvent) {
    throw new ApiError(400, 'Event already exists')
  }

  const event = await Event.create({
    title, description, date, location, organiser
  })

  return event
}

const cancel = async (id) => {
  return await Event.findByIdAndDelete(id)
}

const disenroll = async (eventId, userId) => {
  if(!eventId?.trim() || !userId?.trim()) {
    throw new ApiError(400, 'All fileds are required!')
  }

  const event = await Event.findByIdAndUpdate(
    eventId,
    { $pull: { attendees: userId } },
    { new: true }
  )
  if(!event) {
    throw new ApiError(404, 'Not Found!')
  }

  return event
}

const enroll = async (eventId, userId) => {
  if(!eventId?.trim() || !userId?.trim()) {
    throw new ApiError(400, 'All fileds are required!')
  }

  const event = await Event.findByIdAndUpdate(
    eventId,
    { $addToSet: { attendees: userId } }, // add unless already present
    { new: true }
  )
  if(!event) {
    throw new ApiError(404, 'Not Found!')
  }

  return event
}


export default {
  add,
  cancel,
  disenroll,
  enroll,
  getAll,
  getById,
  getByOrganiser,
}