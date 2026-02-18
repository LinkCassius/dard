const jwt = require("jsonwebtoken");
const config = require("config");
const { decrypt } = require("../helpers/decryption");
const {
  checkUserGroupPermission,
  checkApiPermission,
} = require("../helpers/auth");

module.exports = async function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).json({
      success: false,
      responseCode: 401,
      msg: "Access denied. No token provided.",
    });
  // res.status(401).send("Access denied. No token provided.");
  //  const dectoken = decrypt(token);

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));

    /*
    if(!checkUserGroupPermission(decoded.permission, 'Everything Access')) {
      let permissionFlag;
      await checkApiPermission(req.baseUrl, req.method, decoded.permission).then( flag => {
         permissionFlag =  flag
      });
      if(!permissionFlag) {
        //res.status(401).send("You are not authorized.");
        res
      .status(401)
      .json({
        success: false,
        responseCode: 401,
        msg: "You are not authorized.",
      });
        return;
      }
    }
    */

    //    const decoded = jwt.verify(dectoken, config.get("jwtPrivateKey"));
    req.user = decoded;
    next();
  } catch (ex) {
    console.log("Invalid Token or Expired: ", ex);
    // res.status(401).send("Invalid token.");
    res.status(401).json({
      success: false,
      responseCode: 401,
      msg: "Session Expired",
    });
  }
};
