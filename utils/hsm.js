import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();
async function findSoftHSMPKCS11Lib() {
  const commonSoftHSMPathNames = [
    '/usr/lib/softhsm/libsofthsm2.so',
    '/usr/lib/x86_64-linux-gnu/softhsm/libsofthsm2.so',
    '/usr/local/lib/softhsm/libsofthsm2.so',
    '/usr/lib/libacsp-pkcs11.so',
  ];
  let pkcsLibPath = 'NOT FOUND';
  if (
    typeof process.env.PKCS11_LIB === 'string' &&
    process.env.PKCS11_LIB !== ''
  ) {
    pkcsLibPath = process.env.PKCS11_LIB;
  } else {
    for (const pathnameToTry of commonSoftHSMPathNames) {
      if (fs.existsSync(pathnameToTry)) {
        pkcsLibPath = pathnameToTry;
        console.log('exits')
        break;
      }
    }
  }
  console.log(pkcsLibPath);
  return pkcsLibPath;
}

const softhsmOptions = async () => {
  try {
    const softHSMOptions = {
      lib: await findSoftHSMPKCS11Lib(),
      pin: process.env.PKCS11_PIN || '98765432',
      label: process.env.PKCS11_LABEL || 'ForFabric',
    };
    console.log('softHSMOptions')
    return softHSMOptions;
  } catch (error) {
    process.exit(1);
  }
};

export { softhsmOptions };
