import { Address, BigInt } from '@graphprotocol/graph-ts'
import { assert, clearStore, test } from 'matchstick-as'
import { CreateVesting as CreateVestingEvent } from '../generated/FuroVesting/FuroVesting'
import { FURO_VESTING, WEEK, YEAR } from '../src/constants'
import { onCancelVesting, onCreateVesting, onWithdraw } from '../src/mappings/vesting'
import { createCancelVestingEvent, createTokenMock, createVestingEvent, createWithdrawEvent } from './mocks'

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

const TOTAL_AMOUNT = CLIFF_AMOUNT.plus(STEPS.times(STEPS_AMOUNT)) // 100000000 + (26 * 10000000) = 360000000

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

test('counter variables increases when vesting is created', () => {
  setup()

  assert.fieldEquals('FuroVesting', FURO_VESTING, 'vestingCount', '1')
  assert.fieldEquals('FuroVesting', FURO_VESTING, 'userCount', '2')
  assert.fieldEquals('FuroVesting', FURO_VESTING, 'transactionCount', '1')

  cleanup()
})

test('transaction count increases when a vesting is cancelled', () => {
  setup()
  let recipientAmount = CLIFF_AMOUNT
  let ownerAmount = TOTAL_AMOUNT.minus(recipientAmount)
  let cancelVestingEvent = createCancelVestingEvent(VESTING_ID, ownerAmount, recipientAmount, WETH_ADDRESS, true)

  onCancelVesting(cancelVestingEvent)

  assert.fieldEquals('FuroVesting', FURO_VESTING, 'transactionCount', '3')

  cleanup()
})

test('transaction count increases on withdrawal', () => {
  setup()
  const amount = BigInt.fromString('1337420')
  let withdrawalEvent = createWithdrawEvent(VESTING_ID, WETH_ADDRESS, amount, true)

  onWithdraw(withdrawalEvent)

  assert.fieldEquals('FuroVesting', FURO_VESTING, 'transactionCount', '2')

  cleanup()
})
