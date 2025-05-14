import crypto from "crypto";

const generateCode = () => {
  return crypto.randomInt(100000, 999999).toString();
};

export { generateCode };
