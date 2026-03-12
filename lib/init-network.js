#!/usr/bin/env node
const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

// --- Configuration ---
const BITCOIN_CLI = 'bitcoin-cli -regtest -rpcuser=user -rpcpassword=password -rpcport=18443'
const LIGHTNING_CLI = 'lightning-cli --network=regtest'
const L4_DIR = process.env.LIGHTNING_DIR_4 || '/data/lightning4'
const L5_DIR = process.env.LIGHTNING_DIR_5 || '/data/lightning5' // The Hub
const L6_DIR = process.env.LIGHTNING_DIR_6 || '/data/lightning6' // The Merchant

// --- Helpers ---

function run(cmd) {
    try {
        return execSync(cmd, { encoding: 'utf8' }).trim()
    } catch (e) {
        return ''
    }
}

function lcli(dir, command) {
    const dirBase = require('path').basename(dir)
    const rpcFile = `/tmp/${dirBase}-rpc`
    return run(`${LIGHTNING_CLI} --lightning-dir=${dir} --rpc-file=${rpcFile} ${command}`)
}

function bcli(command) {
    return run(`${BITCOIN_CLI} -rpcwallet=regtestwallet ${command}`)
}

function fundNode(dir, name, amount) {
    console.log(`>> 💰 Funding ${name} (${amount} BTC)...`)
    const result = lcli(dir, 'newaddr')
    const addr = JSON.parse(result).bech32
    bcli(`sendtoaddress ${addr} ${amount}`)
}

function waitForStartup(dir, name) {
    console.log(`>> ⏳ Waiting for ${name} to start...`)
    for (let i = 0; i < 30; i++) {
        try {
            execSync(`${LIGHTNING_CLI} --lightning-dir=${dir} getinfo`, { stdio: 'ignore' })
            console.log(`   ✅ ${name} is ready.`)
            return true
        } catch (e) {
            // Sleep 2 seconds
            execSync('sleep 2')
        }
    }
    console.error(`   ❌ ${name} failed to start.`)
    console.error('      Hint: If you see "bitcoind has gone backwards" in logs, you MUST delete the data folder: rm -rf data')
    process.exit(1)
}

function waitForFunds(dir, name) {
    console.log(`>> ⏳ Waiting for ${name} to see funds...`)
    for (let i = 0; i < 60; i++) {
        const result = lcli(dir, 'listfunds')
        try {
            const funds = JSON.parse(result)
            const confirmed = funds.outputs && funds.outputs.find(o => o.status === 'confirmed')
            if (confirmed) {
                console.log(`   ✅ Funds confirmed for ${name}`)
                return true
            }
        } catch (e) { /* ignore parse errors */ }

        if ((i + 1) % 5 === 0) {
            console.log(`   ... waiting (${i + 1}/60)`)
        }
        execSync('sleep 2')
    }
    console.error(`   ❌ Timeout waiting for funds for ${name}`)
    return false
}

function connectAndOpen(fromDir, toDir, fromName, toName, amountSats) {
    console.log(`>> 🔗 Connecting ${fromName} -> ${toName}...`)

    const toInfo = JSON.parse(lcli(toDir, 'getinfo'))
    const toId = toInfo.id
    const toPort = toInfo.binding[0].port

    // Connect (ignore errors if already connected)
    lcli(fromDir, `connect ${toId}@127.0.0.1:${toPort}`)

    console.log(`>> ⚡ Opening Channel (${amountSats} sats)...`)
    const result = lcli(fromDir, `fundchannel ${toId} ${amountSats}`)
    if (!result) {
        console.log('   ⚠️ Channel open failed (maybe already exists?)')
    }
}

function mineBlocks(n) {
    const addr = bcli('getnewaddress')
    bcli(`generatetoaddress ${n} ${addr}`)
}

// --- Main ---
async function main() {
    console.log('=== 🚀 Initializing Flamingo Network ===')

    // 0. Wait for startup
    waitForStartup(L4_DIR, 'Node 4')
    waitForStartup(L5_DIR, 'Node 5')
    waitForStartup(L6_DIR, 'Node 6')

    // 1. Fund all nodes
    fundNode(L4_DIR, 'Node 4', 5)
    fundNode(L5_DIR, 'Node 5', 5)
    fundNode(L6_DIR, 'Node 6', 5)

    console.log('>> ⛏️  Mining 10 blocks to confirm funding...')
    mineBlocks(10)

    // Wait for nodes to catch up
    waitForFunds(L4_DIR, 'Node 4')
    waitForFunds(L5_DIR, 'Node 5')
    waitForFunds(L6_DIR, 'Node 6')

    // 2. Setup Topology: Node 4 <-> Node 5 <-> Node 6
    console.log('>> 🌐 Establishing peer connections...')

    // Forward path (User -> Hub -> Merchant)
    connectAndOpen(L4_DIR, L5_DIR, 'Node 4', 'Node 5', 1000000)
    connectAndOpen(L5_DIR, L6_DIR, 'Node 5', 'Node 6', 1000000)

    console.log(">> ⛏️  Mining 1 block to confirm Node 5's change output...")
    mineBlocks(1)
    execSync('sleep 2')

    // Reverse path (Merchant -> Hub -> User)
    connectAndOpen(L6_DIR, L5_DIR, 'Node 6', 'Node 5', 1000000)
    connectAndOpen(L5_DIR, L4_DIR, 'Node 5', 'Node 4', 1000000)

    console.log('>> ⛏️  Mining 6 blocks to confirm channels...')
    mineBlocks(6)

    console.log('✅ Network Initialized!')
    console.log('   - All nodes funded with 5 BTC.')
    console.log('   - Channels Established (Bidirectional Ring).')
    console.log('   - Full Routing Capability Ready.')
}

main()
