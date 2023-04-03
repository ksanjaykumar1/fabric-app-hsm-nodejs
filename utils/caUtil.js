import dotenv from 'dotenv';
import { CertificateFail } from '../errors/index.js';
dotenv.config();
const { CONNECTING_ADMIN_USER_ID, CONNECTING_ADMIN_USER_PASSWD } = process.env;

const connecting_admin_user_Id = CONNECTING_ADMIN_USER_ID || 'admin';
const connecting_admin_user_passwd = CONNECTING_ADMIN_USER_PASSWD || 'admin';

const enrollAdmin = async (caClient, wallet, orgMspId) => {
  try {
    console.log(connecting_admin_user_Id);
    const identity = await wallet.get(connecting_admin_user_Id);
    if (identity) {
      console.log(`And identity fro the admin user already exists`);
      return;
    }
    console.log(connecting_admin_user_Id);
    const enrollment = await caClient.enroll({
      enrollmentID: connecting_admin_user_Id,
      enrollmentSecret: connecting_admin_user_passwd,
    });
    const hsmIdentity = {
      credentials: {
        certificate: enrollment.certificate,
      },
      mspId: orgMspId,
      type: 'HSM-X.509',
    };
    await wallet.put(connecting_admin_user_Id, hsmIdentity);
    console.log(
      `Successfully enrolled admin user and imported it into the wallet`
    );
  } catch (error) {
    console.log(`Failed to enroll admin user: ${error}`);
  }
};

const buildCAClient = (FabricCAServices, ccp, caHostName, hsmProvider) => {
  // creates a new CA client for interacting with CA.
  const caInfo = ccp.certificateAuthorities[caHostName]; //lookup CA details from config
  const caTLSCACerts = caInfo.tlsCACerts.pem;
  const caClient = new FabricCAServices(
    caInfo.url,
    { trustedRoots: caTLSCACerts, verify: false },
    caInfo.caName,
    hsmProvider.getCryptoSuite()
  );
  console.log(`Built a CA Client named ${caInfo.caName}`);
  return caClient;
};

export {
  enrollAdmin,
  buildCAClient,
  // registerAndEnrollUser,
  // reEnrollUser,
  // revokeUser,
};
