const functions = require("firebase-functions");
const { google } = require("googleapis");

exports.receipt = functions
  .region("australia-southeast1")
  .https.onCall(async (data) => {

    const d = JSON.stringify({
      "productId": data["productId"],
      "purchaseToken": data["purchaseToken"],
    })
    console.log(d);

    const auth = new google.auth.GoogleAuth({
      keyFile: 'pc-api-7263938244868821830-612-8079ec9789a5.json',
      scopes: ["https://www.googleapis.com/auth/androidpublisher"],
    });

    try {
      const res = await google.androidpublisher({ version: 'v3' })
        .purchases.subscriptions.get({
          packageName: 'com.wagefigurer',
          subscriptionId: data["productId"],
          token: data["purchaseToken"],
          auth: auth,
        });

      if (res.status == 200) {
        functions.logger.info(res.data.paymentState, { structuredData: true, });
        return { isActiveSubscription: res.data.paymentState === 1 };
      }
      return { error: -1 };
    } catch (error) {
      console.log('error', error);
      return { error: -1 };
    }
  });

