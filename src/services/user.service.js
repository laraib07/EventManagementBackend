import { ApiError } from '../utils/index.js'
import { User } from '../models/user.model.js'

async function store(name, email, role, password) {
  const existingUser = await User.findOne({ email })
  if(existingUser) {
    throw new ApiError(400, 'User already exists!')
  }

  const newUser = await User.create({ name, email, role, password })

  return newUser;
}

async function update() {

}


export default {
  update,
  store,
}