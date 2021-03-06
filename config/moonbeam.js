module.exports = {
  network: 'moonbeam',
  native: { address: '0xAcc15dC74880C9944775448304B263D191c6077F' },
  sushi: { address: '0x2C78f1b70Ccf63CDEe49F9233e9fAa99D43AA07e' },
  weth: { address: '0x30D2a9F5FDf90ACe8c17952cbb4eE48a55D916A7' },
  wbtc: { address: '0x1DC78Acda13a8BC4408B207c9E48CDBc096D95e0' },
  whitelistedTokenAddresses: [
    // WGLMR
    '0xAcc15dC74880C9944775448304B263D191c6077F',
    // WETH
    '0x30D2a9F5FDf90ACe8c17952cbb4eE48a55D916A7',
    // USDC
    '0x8f552a71EFE5eeFc207Bf75485b356A0b3f01eC9',
    // USDT
    '0x8e70cD5B4Ff3f62659049e74b6649c6603A0E594',
    // DAI
    '0xc234A67a4F840E61adE794be47de455361b52413',
    // WBTC
    '0x1DC78Acda13a8BC4408B207c9E48CDBc096D95e0',
    // UST
    '0x085416975fe14C2A731a97eC38B9bF8135231F62',
    // FRAX
    '0x322E86852e492a7Ee17f28a78c663da38FB33bfb',
  ],
  stableTokenAddresses: [
    // USDC
    '0x8f552a71EFE5eeFc207Bf75485b356A0b3f01eC9',
    // USDT
    '0x8e70cD5B4Ff3f62659049e74b6649c6603A0E594',
    // DAI
    '0xc234A67a4F840E61adE794be47de455361b52413',
    // UST
    '0x085416975fe14C2A731a97eC38B9bF8135231F62',
    // FRAX
    '0x322E86852e492a7Ee17f28a78c663da38FB33bfb',
  ],
  bentobox: {
    address: '0x80c7dd17b01855a6d2347444a0fcc36136a314de',
    startBlock: 504558,
  },
  legacy: {
    factory: {
      address: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
      initCodeHash: '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303',
      startBlock: 503713,
    },
  },
  miso: {
    accessControls: { address: '0xF4d73326C13a4Fc5FD7A064217e12780e9Bd62c3', startBlock: 504596 },
    market: { address: '0x438a2b1C6c715fb1B051c04CA65755560d8B8d43', startBlock: 504666 },
  },
}
