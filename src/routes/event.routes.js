import { Router } from 'express'
import {
  add,
  cancel,
  disenroll,
  enroll,
  getAll,
  getById,
  getByOrganiser
} from '../controllers/event.controller.js'
import { checkAuth, checkPermission } from '../middleware/auth.middleware.js'
import { checkEventAuth, checkEventDisenrollAuth } from '../middleware/event.middleware.js'
import { PERMISSIONS } from '../utils/constants.js'

const router = Router()

router.route('/add').post(
  checkAuth,
  checkPermission(PERMISSIONS.ADD_EVENT),
  add
)
router.route('/all').get(getAll)
router.route('/:id').get(getById)
router.route('/cancel/:id').delete(
  checkAuth,
  checkPermission(PERMISSIONS.DELETE_EVENT),
  checkEventAuth,
  cancel
)
router.route('/disenroll/:id').post(
  checkAuth,
  checkPermission(PERMISSIONS.DISENROLL_EVENT),
  checkEventDisenrollAuth,
  disenroll
)
router.route('/enroll/:id').post(
  checkAuth,
  checkPermission(PERMISSIONS.ENROLL_EVENT),
  enroll
)
router.route('/organiser/:id').get(getByOrganiser)

export default router