import { ConstantProductPoolKpi, PoolDaySnapshot, PoolHourSnapshot } from '../../generated/schema'
import { DAY_IN_SECONDS, HOUR_IN_SECONDS } from '../constants'

import { BigInt } from '@graphprotocol/graph-ts'

export function updatePoolHourSnapshot(timestamp: BigInt, poolKpi: ConstantProductPoolKpi): PoolHourSnapshot {
  let id = getPoolHourSnapshotId(poolKpi.id, timestamp)

  let snapshot = PoolHourSnapshot.load(id)

  if (snapshot === null) {
    snapshot = new PoolHourSnapshot(id)
    snapshot.date = getHourStartDate(timestamp)
    snapshot.pool = poolKpi.id
  }

  snapshot.liquidity = poolKpi.liquidity
  snapshot.liquidityNative = poolKpi.liquidityNative
  snapshot.liquidityUSD = poolKpi.liquidityUSD

  // snapshot.volume = poolKpi.volume
  // snapshot.volumeNative = poolKpi.volumeNative
  // snapshot.volumeUSD = poolKpi.volumeUSD

  // snapshot.fees = poolKpi.fees
  // snapshot.feesNative = poolKpi.feesNative
  // snapshot.feesUSD = poolKpi.feesUSD

  snapshot.transactionCount = snapshot.transactionCount.plus(BigInt.fromI32(1))
  snapshot.save()

  return snapshot
}

export function updatePoolDaySnapshot(timestamp: BigInt, poolKpi: ConstantProductPoolKpi): PoolDaySnapshot {
  let id = getPoolDaySnapshotId(poolKpi.id, timestamp)
  let snapshot = PoolDaySnapshot.load(id)

  if (snapshot === null) {
    snapshot = new PoolDaySnapshot(id)
    snapshot.date = getDayStartDate(timestamp)
    snapshot.pool = poolKpi.id
  }

  snapshot.liquidity = poolKpi.liquidity
  snapshot.liquidityNative = poolKpi.liquidityNative
  snapshot.liquidityUSD = poolKpi.liquidityUSD

  // snapshot.volume = poolKpi.volume
  // snapshot.volumeNative = poolKpi.volumeNative
  // snapshot.volumeUSD = poolKpi.volumeUSD

  // snapshot.fees = poolKpi.fees
  // snapshot.feesNative = poolKpi.feesNative
  // snapshot.feesUSD = poolKpi.feesUSD

  snapshot.transactionCount = snapshot.transactionCount.plus(BigInt.fromI32(1))
  snapshot.save()

  return snapshot
}

function getHourStartDate(timestamp: BigInt): i32 {
  let hourIndex = timestamp.toI32() / HOUR_IN_SECONDS // get unique hour within unix history
  return hourIndex * HOUR_IN_SECONDS // want the rounded effect
}

function getDayStartDate(timestamp: BigInt): i32 {
  let dayIndex = timestamp.toI32() / DAY_IN_SECONDS // get unique day within unix history
  return dayIndex * DAY_IN_SECONDS // want the rounded effect
}

export function getPoolHourSnapshotId(poolKpiId: string, timestamp: BigInt): string {
  let startDate = getHourStartDate(timestamp)
  return poolKpiId.concat('-hour-').concat(BigInt.fromI32(startDate).toString())
}

export function getPoolDaySnapshotId(poolKpiId: string, timestamp: BigInt): string {
  let startDate = getDayStartDate(timestamp)
  return poolKpiId.concat('-day-').concat(BigInt.fromI32(startDate).toString())
}
