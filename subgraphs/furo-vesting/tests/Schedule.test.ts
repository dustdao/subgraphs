import { Address, BigInt } from '@graphprotocol/graph-ts'
import { assert, clearStore, logStore, test } from 'matchstick-as'
import { CreateVesting as CreateVestingEvent } from '../generated/FuroVesting/FuroVesting'
import { CLIFF, END, START, STEP, WEEK, YEAR } from '../src/constants'
import { onCreateVesting } from '../src/mappings/vesting'
import { createTokenMock, createVestingEvent } from './mocks'

const WETH_ADDRESS = Address.fromString('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2')
const SENDER = Address.fromString('0x00000000000000000000000000000000000a71ce')
const RECIEVER = Address.fromString('0x0000000000000000000000000000000000000b0b')
const VESTING_ID = BigInt.fromString('1')
const CLIFF_AMOUNT = BigInt.fromString('100000000')
const STEPS_AMOUNT = BigInt.fromString('10000000')
const START_TIME = BigInt.fromString('1648297495') // 	Sat Mar 26 2022 12:24:55 GMT+0000
const CLIFF_DURATION = BigInt.fromU32(YEAR)
const biweekly = 2 * WEEK
const STEP_DURATION = BigInt.fromU32(biweekly)
const STEPS = BigInt.fromU32(26)

let vestingEvent: CreateVestingEvent

function setup(): void {
  vestingEvent = createVestingEvent(
    VESTING_ID,
    WETH_ADDRESS,
    SENDER,
    RECIEVER,
    START_TIME,
    CLIFF_DURATION,
    STEP_DURATION,
    STEPS,
    CLIFF_AMOUNT,
    STEPS_AMOUNT,
    true
  )
  createTokenMock(WETH_ADDRESS.toHex(), BigInt.fromString('18'), 'Wrapped Ether', 'WETH')
  onCreateVesting(vestingEvent)
}

function cleanup(): void {
  clearStore()
}

test('vesting creates a schedule and schedule periods with multiple steps', () => {
  setup()

  const id = VESTING_ID.toString()
  assert.fieldEquals('Schedule', id, 'id', id)
  assert.fieldEquals('Schedule', id, 'vesting', id)
  assert.entityCount('SchedulePeriod', 28)

  let passedTime = START_TIME
  let passedAmount = BigInt.fromString('0')
  const startPeriodId = id.concat(':period:0')
  assert.fieldEquals('SchedulePeriod', startPeriodId, 'id', startPeriodId)
  assert.fieldEquals('SchedulePeriod', startPeriodId, 'type', START)
  assert.fieldEquals('SchedulePeriod', startPeriodId, 'time', passedTime.toString())
  assert.fieldEquals('SchedulePeriod', startPeriodId, 'amount', passedAmount.toString())

  passedTime = passedTime.plus(CLIFF_DURATION)
  passedAmount = passedAmount.plus(CLIFF_AMOUNT)
  const cliffPeriodId = id.concat(':period:1')
  assert.fieldEquals('SchedulePeriod', cliffPeriodId, 'id', cliffPeriodId)
  assert.fieldEquals('SchedulePeriod', cliffPeriodId, 'type', CLIFF)
  assert.fieldEquals('SchedulePeriod', cliffPeriodId, 'time', passedTime.toString())
  assert.fieldEquals('SchedulePeriod', cliffPeriodId, 'amount', passedAmount.toString())

  const createdPeriodCount = 2

  for (let i = 0; i < STEPS.toI32() - 1; i++) {
    passedTime = passedTime.plus(STEP_DURATION)
    passedAmount = passedAmount.plus(STEPS_AMOUNT)
    const stepPeriodCount = createdPeriodCount + i
    const stepPeriodId = id.concat(':period:'.concat(stepPeriodCount.toString()))
    assert.fieldEquals('SchedulePeriod', stepPeriodId, 'id', stepPeriodId)
    assert.fieldEquals('SchedulePeriod', stepPeriodId, 'type', STEP)
    assert.fieldEquals('SchedulePeriod', stepPeriodId, 'time', passedTime.toString())
    assert.fieldEquals('SchedulePeriod', stepPeriodId, 'amount', passedAmount.toString())
  }

  passedTime = passedTime.plus(STEP_DURATION)
  passedAmount = passedAmount.plus(STEPS_AMOUNT)
  const endPeriodNumber = createdPeriodCount + STEPS.toI32() - 1
  const endPeriodId = id.concat(':period:'.concat(endPeriodNumber.toString()))
  assert.fieldEquals('SchedulePeriod', endPeriodId, 'id', endPeriodId)
  assert.fieldEquals('SchedulePeriod', endPeriodId, 'type', END)
  assert.fieldEquals('SchedulePeriod', endPeriodId, 'time', passedTime.toString())
  assert.fieldEquals('SchedulePeriod', endPeriodId, 'amount', passedAmount.toString())

  assert.fieldEquals('Vesting', id, 'expiresAt', passedTime.toString())

  cleanup()
})

test('vesting with 365 steps only creates 3 periods', () => {
  const streamId = BigInt.fromString('2')
  const steps = BigInt.fromU32(365)
  const stepduration = BigInt.fromU32(60*60*24)
  const totalAmount = CLIFF_AMOUNT.plus(steps.times(STEPS_AMOUNT)) // 100000000 + (200 * 10000000) = 2100000000
  const endTime = START_TIME.plus(CLIFF_DURATION).plus(steps.times(stepduration)) 

  const vestingEvent2 = createVestingEvent(
    streamId,
    WETH_ADDRESS,
    SENDER,
    RECIEVER,
    START_TIME,
    CLIFF_DURATION,
    stepduration,
    steps,
    CLIFF_AMOUNT,
    STEPS_AMOUNT,
    true
  )
  const id = streamId.toString()
  onCreateVesting(vestingEvent2)

  assert.fieldEquals('Schedule', id, 'id', id)
  assert.fieldEquals('Schedule', id, 'vesting', id)
  assert.entityCount('SchedulePeriod', 4)

  let passedTime = START_TIME
  let passedAmount = BigInt.fromString('0')
  const startPeriodId = id.concat(':period:0')
  assert.fieldEquals('SchedulePeriod', startPeriodId, 'id', startPeriodId)
  assert.fieldEquals('SchedulePeriod', startPeriodId, 'type', START)
  assert.fieldEquals('SchedulePeriod', startPeriodId, 'time', passedTime.toString())
  assert.fieldEquals('SchedulePeriod', startPeriodId, 'amount', passedAmount.toString())

  passedTime = passedTime.plus(CLIFF_DURATION)
  passedAmount = passedAmount.plus(CLIFF_AMOUNT)
  const cliffPeriodId = id.concat(':period:1')
  assert.fieldEquals('SchedulePeriod', cliffPeriodId, 'id', cliffPeriodId)
  assert.fieldEquals('SchedulePeriod', cliffPeriodId, 'type', CLIFF)
  assert.fieldEquals('SchedulePeriod', cliffPeriodId, 'time', passedTime.toString())
  assert.fieldEquals('SchedulePeriod', cliffPeriodId, 'amount', passedAmount.toString())

  passedTime = passedTime.plus(stepduration)
  passedAmount = passedAmount.plus(STEPS_AMOUNT)
  const stepPeriodId = id.concat(':period:2')
  assert.fieldEquals('SchedulePeriod', stepPeriodId, 'id', stepPeriodId)
  assert.fieldEquals('SchedulePeriod', stepPeriodId, 'type', STEP)
  assert.fieldEquals('SchedulePeriod', stepPeriodId, 'time', passedTime.toString())
  assert.fieldEquals('SchedulePeriod', stepPeriodId, 'amount', passedAmount.toString())

  const endPeriodId = id.concat(':period:3')
  assert.fieldEquals('SchedulePeriod', endPeriodId, 'id', endPeriodId)
  assert.fieldEquals('SchedulePeriod', endPeriodId, 'type', END)
  assert.fieldEquals('SchedulePeriod', endPeriodId, 'time', endTime.toString())
  assert.fieldEquals('SchedulePeriod', endPeriodId, 'amount', totalAmount.toString())

  assert.fieldEquals('Vesting', id, 'expiresAt', endTime.toString())

  cleanup()
})
