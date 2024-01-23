import {
  createContextAndStartServer,
  Stage,
  stopServerAndCloseMySqlContext,
} from '../helpers/context';
import * as request from 'supertest';
import { setupTestDatabase, clearTestDatabase } from '../helpers/migrations';
import { User } from '../../models/user';
import { ethers, HDNodeWallet } from 'ethers';
import { Identity } from '@apillon/sdk';

let stage: Stage;
let user: User;
let wallet: HDNodeWallet;

describe('claim airdrop', () => {
  beforeAll(async () => {
    stage = await createContextAndStartServer();
    await setupTestDatabase();

    wallet = ethers.Wallet.createRandom();
    user = new User({}, stage.context).fake().populate({ wallet: wallet.address });
    await user.create();
  });

  afterAll(async () => {
    await clearTestDatabase();
    await stopServerAndCloseMySqlContext(stage);
  });

  test('successfully claims', async () => {
    const identity = new Identity();
    const message = identity.generateSigningMessage('test');
    const signature = await wallet.signMessage(message.message);

    const data = {
      address: wallet.address,
      timestamp: message.timestamp,
      signature,
    };

    const res = await request(stage.app).post('/users/claim').send(data);

    expect(res.status).toBe(200);
    expect(res.body.data.signature).toBeDefined();
    const fetchUser = await new User({}, stage.context).populateByWallet(user.wallet);
    expect(fetchUser.signature).toBeDefined();
  });
});
