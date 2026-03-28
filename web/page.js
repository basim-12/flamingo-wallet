const STATE = require('STATE')
const statedb = STATE(__filename)

function defaults() {
  return {
    drive: {},
    _: {
      'flamingo-ui': {
        $: '',
        _: {
          'home_page': { $: '' }
        }
      }
    }
  }
}

statedb.admin()
const { sdb } = statedb(defaults)

async function start() {
  const [{ sid }] = await sdb.watch(() => { })
  const wallet = require('flamingo-ui')
  document.body.append(wallet(sid))
}

start()
