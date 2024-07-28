import mongoose, { Schema } from 'mongoose'

const eventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true},
    description: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    organiser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    attendees: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  { timestamps: true }
)

export const Event = mongoose.model('Event', eventSchema)
