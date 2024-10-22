export const APP_NAME = 'Trident Pets'
export const ALCHEMY_ID = 'V0GBx3HvoKur4WN_W2n1hdCu26TZdMSw'

export const MODE = 'prod'; // dev | prod
// Krakens
export const TESTNET_CONTRACT = '0x18Ec0b9ED4ab29d5AB6f57d7EfCeD1a9992aaC37';
export const PROD_CONTRACT = '0x6389936FAC235a4FADF660Ca5c428084115579Bb';
// Airdrop
export const AIRDROP_TESTNET_CONTRACT = '0xC38a65a673A0193e543db2D6dA6F18e48DAfF443';
export const AIRDROP_PROD_CONTRACT = '0x77b7d9a6513bfb1679c778b257c198f44a78fa69';

// @ts-ignore
export const CONTRACT_ADDRESS = (MODE === 'prod') ? PROD_CONTRACT : TESTNET_CONTRACT;
// @ts-ignore
export const AIRDROP_ADDRESS = (MODE === 'prod') ? AIRDROP_PROD_CONTRACT : AIRDROP_TESTNET_CONTRACT;