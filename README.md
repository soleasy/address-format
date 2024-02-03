# address-format

Demonstrate 4 different address formats on the Solana chain.

```ts
const mnemonic =
  `abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon`;

const seed = bip39.mnemonicToSeedSync(mnemonic);
```

### ASK (No derivation path)

```sh
❯ solana-keygen pubkey --skip-seed-phrase-validation ASK
8taGeq8TnGstntRe1QXkdeHjrXX23qCrjgmDrgREk2KW
```

```ts
Keypair.fromSeed(seed.subarray(0, 32));
```

### BIP44 (`m/44'/501'/0'`) derive using `ed25519`

```sh
❯ solana-keygen pubkey --skip-seed-phrase-validation 'prompt://?key=0'
6DTsKTQqiSeP961PbPnPDN2KJ1eKdiLhCCDpkVpkkZF
```

```ts
const derivedSeed = derivePath(`m/44'/501'/${walletIndex}'`, seed).key;
Keypair.fromSeed(derivedSeed);
```

### BIP44Change (`m/44'/501'/0'/0'`) derive using `ed25519`

```sh
❯ solana-keygen pubkey --skip-seed-phrase-validation 'prompt://?key=0/0'
9jSYUQBwV3N2Hg7CocFgQGiCNo8zGSTDymktpHGu9aLe
```

```ts
const derivedSeed = derivePath(`m/44'/501'/${walletIndex}'/0'`, seed).key;
Keypair.fromSeed(derivedSeed);
```

### Deprecated: (`m/501'/0'/0/0`) derive using `bip32`

NOT supported from solana-keygen command line

```ts
import { BIP32Factory } from "bip32";
import * as ecc from "tiny-secp256k1";

const bip32 = BIP32Factory(ecc);

const derivedSeed = bip32.fromSeed(seed)
  .derivePath(`m/501'/${walletIndex}'/0/${accountIndex}`)
  .privateKey;
Keypair.fromSeed(derivedSeed);
```
