// const port = 5008;
const port = process.env.PORT || 6008;
const secretKey = "adlfjadlkjflkadjflk";
const expiredAfter = 999 * 365 * 24 * 1 * 60 * 60 * 1000;
const masterConst = {
  not_deleted: 0,
  deleted: 1,
  active: 1,
  inactive: 0,
};

const accessKeyId = "AKIAIDDDDDD3WPBTJW55T3DOWQ";
const secretAccessKey = "utNAEeessspCnJnHITytFNziq7GKtSjmh9NfwOCLJR8rbu";

const mailSettings = {
  // mailId: "dardlea.notification@gmail.com",
  // mailPwd: "dardlea#123$",
  mailId: "Dardleasystem@mpg.gov.za", //"dardleamppms@gmail.com",
  mailPwd: "dec.2021", //"Dardlea@123",
  host: "mail.mpg.gov.za", //"mail.mpg.gov.za", //"smtp.gmail.com",
  port: 587, //465, //gmail 587.net
  secure: false,
};

const acsEmail = {
    useManagedIdentity: false, // true to use MSI; false uses connection string
    primaryConnectionString: "endpoint=https://emailalertmpg.unitedstates.communication.azure.com/;accesskey=2rTW0JEgIeuXXMYU7mhHtKAmCoGc50tom5KdnZDgo8l1yjMyiTqQJQQJ99BCACULyCpxpCChAAAAAZCSN1Cf", // "endpoint=...;accesskey=..."
    secondaryConnectionString: "endpoint=https://emailalertmpg.unitedstates.communication.azure.com/;accesskey=FiJ3ZvCZy5nBKAlPPMl4s78eUy4DUPpZRgNwKLAnChOObQGQreb9JQQJ99BCACULyCpxpCChAAAAAZCS0JyN", // required if useManagedIdentity=true

    // Mail settings
    senderAddress: "DoNotReply@mpg.gov.za", 
    // Optional behavior
    userEngagementTrackingDisabled: true,
  };

//alertSettings are showing red/green
const alertSettings = {
  contractAlert: 15,
  milestoneAlert: 7,
  taskAlert: 3,
};

//const siteUrl = "http://localhost:3000";
const siteUrl = "https://dardlea.azurewebsites.net";

module.exports =  {
  port,
  masterConst,
  secretKey,
  expiredAfter,
  accessKeyId,
  secretAccessKey,
  mailSettings,
  alertSettings,
  siteUrl,
  acsEmail
};
