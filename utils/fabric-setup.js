import dotenv from 'dotenv';
import { buildCCP } from './appUtil.js';
import { HsmX509Provider, Wallets } from 'fabric-network';
import { softhsmOptions } from './hsm.js';
import { buildCAClient, enrollAdmin } from './caUtil.js';
import FabricCAServices from 'fabric-ca-client';
dotenv.config();

const { CONNECTING_ORG, CONNECTING_CA_HOST_NAME, WALLET_PATH, CONNECTING_MSP } =
  process.env;
const connecting_org = CONNECTING_ORG || 'org1';
const connecting_ca_host_name =
  CONNECTING_CA_HOST_NAME || 'ca.org1.example.com';
const connecting_msp = CONNECTING_MSP || 'Org1MSP';
const walletPath = WALLET_PATH || './wallet';

let ccp, caClient, wallet, hsmProvider;

const fabriSetup = async () => {
  try {
    ccp = await buildCCP();
    hsmProvider = new HsmX509Provider(await softhsmOptions());
    caClient = buildCAClient(
      FabricCAServices,
      ccp,
      connecting_ca_host_name,
      hsmProvider
    );
    wallet = await Wallets.newFileSystemWallet(walletPath);
    wallet.getProviderRegistry().addProvider(hsmProvider);
    await enrollAdmin(caClient, wallet, connecting_msp);
  } catch (error) {
    console.log(`Fabric setup failed  due to ${error}`);
    process.exit(1);
  }
};

export { ccp, caClient, wallet, fabriSetup };
