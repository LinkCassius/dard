const { ScreenCategory } = require("../models/screencategory");

function checkUserGroupPermission(groupPermission, permission) {
  let index = groupPermission.findIndex(function(obj) {
  //  console.log("obj", obj);
    return obj === permission;
  });
  if (index >= 0) return true;
  return false;
}

async function checkApiPermission(route, method, permission = []) {
  let permissionName;

  let screens = await ScreenCategory.find({
    "options.API.name": `${route}`,
    "options.API.method": method
  });

  for (let index = 0; index < screens.length; index++) {
    const element = screens[index]._doc;
    for (let j = 0; j < element.options.length; j++) {
      const option = element.options[j];
      if (
        typeof option.API !== "undefined" &&
        option.API.name === route &&
        typeof option.API.method !== "undefined" && option.API.method === method
      ) {
        permissionName = option.value;
        break;
      }
    }
    if (permissionName) break;
  }

  return permission.includes(permissionName);
}

exports.checkUserGroupPermission = checkUserGroupPermission;
exports.checkApiPermission = checkApiPermission;
