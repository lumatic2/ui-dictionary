import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import test from 'node:test'

import { installSignalCleanup, SIGNAL_ESCALATION_MS } from './eq0-signal.mjs'

function harness() {
  const hostProcess = new EventEmitter()
  const child = new EventEmitter()
  child.pid = 8123
  const kills = []
  const timers = []
  const cleared = []
  const errors = []
  const exits = []

  const controller = installSignalCleanup({
    child,
    hostProcess,
    killProcessImpl: (pid, signal) => {
      kills.push({ pid, signal })
    },
    setTimeoutImpl: (callback, delay) => {
      const timer = { callback, delay }
      timers.push(timer)
      return timer
    },
    clearTimeoutImpl: (timer) => {
      cleared.push(timer)
    },
    onExit: (...args) => exits.push(args),
    onError: (error) => errors.push(error),
  })

  return { hostProcess, child, kills, timers, cleared, errors, exits, controller }
}

function groupKill(state, signal) {
  return { pid: -state.child.pid, signal }
}

test('forwards first SIGINT/SIGTERM and escalates to SIGKILL after the bound', () => {
  for (const signal of ['SIGINT', 'SIGTERM']) {
    const state = harness()

    state.hostProcess.emit(signal)

    assert.deepEqual(state.kills, [groupKill(state, signal)])
    assert.equal(state.timers.length, 1)
    assert.equal(state.timers[0].delay, SIGNAL_ESCALATION_MS)

    state.timers[0].callback()

    assert.deepEqual(state.kills, [groupKill(state, signal), groupKill(state, 'SIGKILL')])
  }
})

test('a second signal escalates immediately and exit clears listeners and timer', () => {
  const state = harness()

  state.hostProcess.emit('SIGINT')
  state.hostProcess.emit('SIGTERM')

  assert.deepEqual(state.kills, [groupKill(state, 'SIGINT'), groupKill(state, 'SIGKILL')])
  assert.equal(state.cleared.length, 1)

  state.child.emit('exit', 0, null)

  assert.equal(state.controller.isExited(), true)
  assert.deepEqual(state.exits, [[0, null]])
  assert.equal(state.hostProcess.listenerCount('SIGINT'), 0)
  assert.equal(state.hostProcess.listenerCount('SIGTERM'), 0)
  assert.equal(state.hostProcess.listenerCount('exit'), 0)
  assert.equal(state.child.listenerCount('exit'), 0)
  assert.equal(state.child.listenerCount('error'), 0)

  state.hostProcess.emit('SIGTERM')
  assert.deepEqual(state.kills, [groupKill(state, 'SIGINT'), groupKill(state, 'SIGKILL')])
})

test('child error clears the pending escalation and signal listeners', () => {
  const state = harness()
  const error = new Error('electron failed to start')

  state.hostProcess.emit('SIGTERM')
  state.child.emit('error', error)

  assert.deepEqual(state.errors, [error])
  assert.equal(state.cleared.length, 1)
  assert.equal(state.controller.isExited(), true)
  assert.equal(state.hostProcess.listenerCount('SIGINT'), 0)
  assert.equal(state.hostProcess.listenerCount('SIGTERM'), 0)
  assert.equal(state.hostProcess.listenerCount('exit'), 0)
  assert.equal(state.child.listenerCount('exit'), 0)
  assert.equal(state.child.listenerCount('error'), 0)
})

test('host exit kills a still-running child immediately', () => {
  const state = harness()

  state.hostProcess.emit('exit')

  assert.deepEqual(state.kills, [groupKill(state, 'SIGKILL')])
  assert.equal(state.hostProcess.listenerCount('SIGINT'), 0)
  assert.equal(state.hostProcess.listenerCount('SIGTERM'), 0)
  assert.equal(state.hostProcess.listenerCount('exit'), 0)
  assert.equal(state.child.listenerCount('exit'), 0)
  assert.equal(state.child.listenerCount('error'), 0)
})
