/* eslint-disable */
import { JSEncrypt } from 'jsencrypt'
const publicKey = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDEqT5Dmw/mnLDx7dVXfJom/g9N
5s+h6gEhcFl/Z33W3235He6EBHbIptbxk+U3XU6Jrs7mZLF6trK1Y+XKy0QvWnsc
FxVbYFNhkbIPrCW2HjX2gu6KKOmoey6ZBB/Wao9QeR5I1IUHYA1Ypebj8G51A94Q
pEprlr0Mz6rQxDE/jwIDAQAB`
export default {
  // rsa加密
  encrypt(data) {
    let encryptor = new JSEncrypt();
    encryptor.setPublicKey(publicKey);
    return encryptor.encrypt(data);
  },
  // rsa解密
  decrypt(privateKey,data){
    let decryptor = new JSEncrypt();
    decryptor.setPrivateKey(privateKey);
    return decryptor.decrypt(data)
  }
}