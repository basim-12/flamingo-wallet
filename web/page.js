const STATE = require('STATE')
const statedb = STATE(__filename)

const wallet = require('flamingo-ui')

function defaults () {
  return {
    drive: {},
    _: {}
  }
}

const { sdb } = statedb(defaults)
const [{ sid }] = sdb.onwatch(() => {})

document.body.append(wallet(sid))
