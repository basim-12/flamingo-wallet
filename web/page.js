const STATE = require('STATE')
const statedb = STATE(__filename)

statedb.admin()
const { sdb } = statedb(defaults)

const wallet = require('flamingo-ui')

async function start() {
  const [{ sid }] = await sdb.watch(() => { })
  document.body.append(await wallet(sid))
}

start()


function defaults() {
  return {
    drive: { style: {}, data: {}, icons: {} },
    _: {
      'flamingo-ui': { $: '', 0: '', mapping: { style: 'style', data: 'data', icons: 'icons' } }
    }
  }
}