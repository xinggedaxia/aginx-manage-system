/* eslint-disable */
import { JSEncrypt } from 'jsencrypt'
const publicKey = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDEqT5Dmw/mnLDx7dVXfJom/g9N
5s+h6gEhcFl/Z33W3235He6EBHbIptbxk+U3XU6Jrs7mZLF6trK1Y+XKy0QvWnsc
FxVbYFNhkbIPrCW2HjX2gu6KKOmoey6ZBB/Wao9QeR5I1IUHYA1Ypebj8G51A94Q
pEprlr0Mz6rQxDE/jwIDAQAB`
const privateKey = `MIICXwIBAAKBgQDEqT5Dmw/mnLDx7dVXfJom/g9N5s+h6gEhcFl/Z33W3235He6E
BHbIptbxk+U3XU6Jrs7mZLF6trK1Y+XKy0QvWnscFxVbYFNhkbIPrCW2HjX2gu6K
KOmoey6ZBB/Wao9QeR5I1IUHYA1Ypebj8G51A94QpEprlr0Mz6rQxDE/jwIDAQAB
AoGBAJbdzupGNniPlB7EeXnYGNn45Py6KGbqAVwJuF7Iof0JAnCtyaB1XDqp4xMI
hjtm1S1CcW7FqHGfXpFQxaRBM1hWY5tud1JGsYTWRX+JCZw0bPAxtiJ3qF1gArLj
9QfwO6vezf1wfoahickq/8lmjkJC8unsRvFoVa4j/EEjeGEBAkEA+Fk8bjE4Glpq
PuPxPMTL40U/DS9dS2fLS4tc0/Agu9l7WND18P9eFwlK/9r/m8Zd2liFgmDzRaKU
QPfpMRJ34QJBAMq4Vws7be465fiqsMNeXNk7MpvxyaqDSNOoRYDH/6Fz9pkNSXIo
CTdVrDn920vB+Tc5GXxMgke9LMLeTVpT5W8CQQCT91747FxX3zzkIZ1OrpYn388U
RP8Z+Up3xR3WrIBkS8yg+0c9gnkF0qSb0lhu8H5kpE9PggIPoDEikFKgyTchAkEA
w5/OR8WK2Qk3YZb+SxoliW/p77kNPiHAxpesspDNq/Um9B1xUds2wZJISBIkbF/8
agENCfkfA7GXn1k81jz9uwJBAPZTKeHiS4jolZqRZPp0Cguc0tXyNEpxN2E+SeOr
gx2d/wPpyJMB47eFsR30hZpmq8AahEu2Hz27d0JT5PMZFbU=`
export default {
  // rsa加密
  encrypt(data) {
    let encryptor = new JSEncrypt();
    encryptor.setPublicKey(publicKey);
    return encryptor.encrypt(data);
  },
  // rsa解密
  decrypt(data){
    let decryptor = new JSEncrypt();
    decryptor.setPrivateKey(privateKey);
    return decryptor.decrypt(data)
  }
}