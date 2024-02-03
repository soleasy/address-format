import * as bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import { Keypair } from "@solana/web3.js";

import { BIP32Factory } from 'bip32';
import * as ecc from 'tiny-secp256k1';

const bip32 = BIP32Factory(ecc);

export const DERIVATION_PATH = {
    deprecated: 'deprecated',
    legacy: 'legacy',
    bip44: 'bip44',
    bip44Change: 'bip44Change',
};

function deriveSeed(seed: Buffer, walletIndex = 0, derivationPath = DERIVATION_PATH.bip44Change, accountIndex = 0) {
    switch (derivationPath) {
        case DERIVATION_PATH.deprecated:
            const path = `m/501'/${walletIndex}'/0/${accountIndex}`;
            return bip32.fromSeed(seed).derivePath(path).privateKey;
        case DERIVATION_PATH.legacy:
            return seed.subarray(0, 32);
        case DERIVATION_PATH.bip44:
            const path44 = `m/44'/501'/${walletIndex}'`;
            return derivePath(path44, seed.toString('hex')).key;
        case DERIVATION_PATH.bip44Change:
            const path44Change = `m/44'/501'/${walletIndex}'/0'`;
            return derivePath(path44Change, seed.toString('hex')).key;
        default:
            throw new Error(`invalid derivation path: ${derivationPath}`);
    }
}

const mnemonic = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon";
const seed = bip39.mnemonicToSeedSync(mnemonic);

for (const path of [DERIVATION_PATH.deprecated, DERIVATION_PATH.legacy, DERIVATION_PATH.bip44, DERIVATION_PATH.bip44Change]) {
    const derivedSeed = deriveSeed(seed, 0, path, 0);
    const keypair = Keypair.fromSeed(derivedSeed as Uint8Array);
    console.log(path.padEnd(15, ' '), keypair.publicKey.toBase58());
}
/*
deprecated      CoxSu9u1kpXaYkuk7im8tUnTya6KFxDLRNwcb8CuLR6u
legacy          8taGeq8TnGstntRe1QXkdeHjrXX23qCrjgmDrgREk2KW
bip44           6DTsKTQqiSeP961PbPnPDN2KJ1eKdiLhCCDpkVpkkZF
bip44Change     9jSYUQBwV3N2Hg7CocFgQGiCNo8zGSTDymktpHGu9aLe
*/
