import * as crypto from "crypto";
import { hashStrategy } from "../config/config";

export const hashPwd = (p: string): string => {
  const hmac = crypto.createHmac(hashStrategy.algorithm, hashStrategy.salt);
  hmac.update(p);
  return hmac.digest("hex");
};
