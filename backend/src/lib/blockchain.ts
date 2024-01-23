import { ethers } from 'ethers';
import { env } from '../config/env';

export async function generateSignature(wallet: string, amount: number) {
  const signer = new ethers.Wallet(env.SIGNATURE_PRIVATE_KEY);

  const dataHash = ethers.solidityPackedKeccak256(
    ['address', 'uint256', 'address'],
    [wallet, amount, env.SIGNATURE_CONTRACT_ADDRESS]
  );

  return await signer.signMessage(ethers.getBytes(dataHash));
}
