const STATE = require('STATE')
const statedb = STATE(__filename)
statedb.admin()

// Load the wallet UI
require('flamingo-ui/src/node_modules/wallet') // now a re-useable module
