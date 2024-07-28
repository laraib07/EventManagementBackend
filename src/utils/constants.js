const DB_NAME = 'node_rbac'

const ROLE = {
  ADMIN: 'admin',
  ORGANISER: 'organiser',
  PARTICIPANT: 'participant'
}

const PERMISSIONS = {
  ADMIN: 'admin',
  ADD_EVENT: 'add_event',
  DELETE_EVENT: 'delete_event',
  ENROLL_EVENT: 'enroll_event',
  DISENROLL_EVENT: 'disenroll_event',
}

const roleHavePermissions = (() => {
  const map = new Map();
  map.set(ROLE.ADMIN, [
    PERMISSIONS.ADMIN
  ])
  map.set(ROLE.ORGANISER, [
    PERMISSIONS.ADD_EVENT,
    PERMISSIONS.DELETE_EVENT,
    PERMISSIONS.DISENROLL_EVENT
  ])
  map.set(ROLE.PARTICIPANT, [
    PERMISSIONS.ENROLL_EVENT,
    PERMISSIONS.DISENROLL_EVENT
  ])
  return map;
})()

export { DB_NAME, ROLE, PERMISSIONS, roleHavePermissions }