import { BigInt } from '@graphprotocol/graph-ts'
import { RoleAdminChanged, RoleGranted, RoleRevoked } from '../../generated/AccessControls/AccessControls'
import { ADMIN, MINTER, OPERATOR, SMART_CONTRACT } from '../constants'
import { getOrCreateAccessControls, getOrCreateRole, getOrCreateUser } from '../functions'

export function onRoleAdminChanged(event: RoleAdminChanged): void {
  const accessControls = getOrCreateAccessControls()
  const role = getOrCreateRole(event.params.newAdminRole)
  role.save()

  accessControls.adminCount = accessControls.adminCount.plus(BigInt.fromI32(1))
  accessControls.save()
}

export function onRoleGranted(event: RoleGranted): void {
  const accessControls = getOrCreateAccessControls()

  const role = getOrCreateRole(event.params.role)
  if (event.params.role == ADMIN) {
    accessControls.adminCount = accessControls.adminCount.plus(BigInt.fromI32(1))
  } else if (event.params.role == MINTER) {
    accessControls.minterCount = accessControls.minterCount.plus(BigInt.fromI32(1))
  } else if (event.params.role == OPERATOR) {
    accessControls.operatorCount = accessControls.operatorCount.plus(BigInt.fromI32(1))
  } else if (event.params.role == SMART_CONTRACT) {
    accessControls.smartContractCount = accessControls.smartContractCount.plus(BigInt.fromI32(1))
  }
  accessControls.save()

  const user = getOrCreateUser(event.params.account.toHex())
  user.role = role.id
  user.save()
}

export function onRoleRevoked(event: RoleRevoked): void {
  const accessControls = getOrCreateAccessControls()
  const role = getOrCreateRole(event.params.role)
  if (event.params.role == ADMIN) {
    accessControls.adminCount = accessControls.adminCount.minus(BigInt.fromI32(1))
  } else if (event.params.role == MINTER) {
    accessControls.minterCount = accessControls.minterCount.minus(BigInt.fromI32(1))
  } else if (event.params.role == OPERATOR) {
    accessControls.operatorCount = accessControls.operatorCount.minus(BigInt.fromI32(1))
  } else if (event.params.role == SMART_CONTRACT) {
    accessControls.smartContractCount = accessControls.smartContractCount.minus(BigInt.fromI32(1))
  }
  accessControls.save()

  const user = getOrCreateUser(event.params.account.toHex())
  user.role = ''
  user.save()
}
