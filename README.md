# fabric-app-hsm-nodejs



## How to use
1. Create folder called connectionProfiles
2. add the CCP of org1 and org2 in the connectionProfiles
3. Remember to replace the CCP file whenever a new network is created
4. install softHSM in your local system
5. export SOFTHSM2_CONF=$PWD/softhsm2.conf
6. softhsm2-util --init-token --slot 0 --label "ForFabric" --pin 98765432 --so-pin 1234

## Sample ENV

PORT=3000
WALLET_PATH='./wallet'
CONNECTING_ORG='org1'
CONNECTING_MSP='Org1MSP'
CONNECTING_CA_HOST_NAME = 'ca.org1.example.com'
CONNECTING_ADMIN_USER_ID = 'admin'
CONNECTING_ADMIN_USER_PASSWD = 'adminpw'
CONNECTING_CCP_FILE_PATH = './connectionProfiles/connection-org1.json'
PKCS11_LIB='/usr/lib/softhsm/libsofthsm2.so'


## Todo
1. Handle enrollement when already enrolled and cert present in wallet
2. Handle register and enrollment after revocation