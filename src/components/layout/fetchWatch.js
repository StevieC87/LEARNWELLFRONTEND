// One wrapper around window.fetch for everything that watches API calls
// (ApiOffline, UpgradeNotice), instead of each patching it and putting back
// the fetch it saw. Two hand-rolled patches undone out of order drop one
// watcher, or reinstate a dead one whose closure still sets state.
//
// The wrapper goes in when the first watcher arrives and comes out with the
// last, and only if nothing has wrapped fetch over it since: putting back the
// native fetch then would throw away that later wrapper too.

const watchers = new Set()
let native = null
let wrapper = null

const urlOf = (input) => (typeof input === 'string' ? input : input?.url || String(input ?? ''))

function install() {
  // Kept in the closure as well: a later wrapper may still call this one
  // after the last watcher has gone.
  const underneath = window.fetch
  native = underneath
  wrapper = async (...args) => {
    const url = urlOf(args[0])
    try {
      const res = await underneath(...args)
      watchers.forEach((watcher) => watcher.response?.(res, url))
      return res
    } catch (error) {
      watchers.forEach((watcher) => watcher.error?.(error, url))
      throw error
    }
  }
  window.fetch = wrapper
}

// watcher: { response(res, url), error(error, url) }, either optional.
// Returns the function that stops watching.
export function watchFetch(watcher) {
  if (!watchers.size) install()
  watchers.add(watcher)
  return () => {
    if (!watchers.delete(watcher) || watchers.size) return
    if (window.fetch === wrapper) window.fetch = native
    native = null
    wrapper = null
  }
}

// The fetch underneath the wrapper, so a probe can never feed the watcher
// that triggered it.
export const nativeFetch = (...args) => (native || window.fetch)(...args)
