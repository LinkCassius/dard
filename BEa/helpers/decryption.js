const crypto = require("crypto");
const config = require("config");
const iv = crypto.randomBytes(16);

function encrypt(encrystring) {
  const cipher = crypto.createCipher(
    "aes192",
    config.get("tokenEncryptionKey")
  );
  var encrypted = cipher.update(encrystring, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

function decrypt(decrystring) {
  const decipher = crypto.createDecipher(
    "aes192",
    config.get("tokenEncryptionKey")
  );
  var decrypted = decipher.update(decrystring, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

exports.encrypt = encrypt;
exports.decrypt = decrypt;
