import { Application } from "express";
import { NextFunction, Request, Response } from "../http";
import { RouteErrorCode, SerializedStrategy } from "../config/values";
import { ResourceError } from "../lib/errors";
import { User } from "../models/user";
import { Identity } from "@apillon/sdk";
import { generateSignature } from "../lib/blockchain";

/**∂
 * Installs new route on the provided application.
 * @param app ExpressJS application.
 */
export function inject(app: Application) {
  app.post(
    "/users/claim",
    (req: Request, res: Response, next: NextFunction) => {
      resolve(req, res).catch(next);
    }
  );
}

export async function resolve(req: Request, res: Response): Promise<void> {
  const { context, body } = req;

  if (!body.signature || !body.address) {
    throw new ResourceError(RouteErrorCode.SIGNATURE_NOT_PRESENT);
  }

  const identity = new Identity(null);
  const { isValid } = await identity.validateEvmWalletSignature({
    walletAddress: body.address,
    signature: body.signature,
    signatureValidityMinutes: 10,
    message: `test\n${body.timestamp}`,
    timestamp: body.timestamp,
  });

  if (!isValid) {
    throw new ResourceError(RouteErrorCode.SIGNATURE_NOT_PRESENT);
  }

  const user = await new User({}, context).populateByWallet(body.address);

  if (!user.exists()) {
    throw new ResourceError(RouteErrorCode.USER_DOES_NOT_EXIST);
  }

  if (new Date().getTime() >= context.env.CLAIM_START) {
    const signature = await generateSignature(user.wallet, user.amount);
    user.signature = signature;
    await user.update();
  }
  return res.respond(200, user.serialize(SerializedStrategy.PROFILE));
}
