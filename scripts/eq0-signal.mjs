export const SIGNAL_ESCALATION_MS = 1500

export function installSignalCleanup({
  child,
  hostProcess,
  escalationMs = SIGNAL_ESCALATION_MS,
  setTimeoutImpl = setTimeout,
  clearTimeoutImpl = clearTimeout,
  onExit = () => {},
  onError = () => {},
}) {
  let childExited = false
  let stopRequested = false
  let killSent = false
  let escalationTimer
  let cleaned = false

  const clearEscalation = () => {
    if (escalationTimer === undefined) return
    clearTimeoutImpl(escalationTimer)
    escalationTimer = undefined
  }

  const cleanup = () => {
    if (cleaned) return
    cleaned = true
    clearEscalation()
    hostProcess.removeListener('SIGINT', handleSigint)
    hostProcess.removeListener('SIGTERM', handleSigterm)
    hostProcess.removeListener('exit', handleHostExit)
    child.removeListener('exit', handleChildExit)
    child.removeListener('error', handleChildError)
  }

  const finishExit = (code, signal) => {
    if (childExited) return
    childExited = true
    cleanup()
    onExit(code, signal)
  }

  const finishError = (error) => {
    if (childExited) return
    childExited = true
    cleanup()
    onError(error)
  }

  const kill = (signal) => {
    if (childExited || (signal === 'SIGKILL' && killSent)) return
    if (signal === 'SIGKILL') killSent = true
    try {
      child.kill(signal)
    } catch (error) {
      finishError(error)
    }
  }

  const scheduleEscalation = () => {
    escalationTimer = setTimeoutImpl(() => {
      escalationTimer = undefined
      kill('SIGKILL')
    }, escalationMs)
  }

  function handleSignal(signal) {
    if (childExited) return
    if (stopRequested) {
      clearEscalation()
      kill('SIGKILL')
      return
    }
    stopRequested = true
    kill(signal)
    if (!childExited) scheduleEscalation()
  }

  function handleSigint() {
    handleSignal('SIGINT')
  }

  function handleSigterm() {
    handleSignal('SIGTERM')
  }

  function handleHostExit() {
    if (childExited) return
    clearEscalation()
    kill('SIGKILL')
    cleanup()
  }

  function handleChildExit(code, signal) {
    finishExit(code, signal)
  }

  function handleChildError(error) {
    finishError(error)
  }

  hostProcess.on('SIGINT', handleSigint)
  hostProcess.on('SIGTERM', handleSigterm)
  hostProcess.once('exit', handleHostExit)
  child.once('exit', handleChildExit)
  child.once('error', handleChildError)

  return {
    cleanup,
    isExited: () => childExited,
    isStopping: () => stopRequested,
  }
}
