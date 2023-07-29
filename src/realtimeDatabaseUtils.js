const admin = require("firebase-admin");
const adminSDKKey = require("../keystore/dev-video-conference-firebase-adminsdk.json");

admin.initializeApp({
    credential: admin.credential.cert(adminSDKKey),
    databaseURL: process.env.REACT_APP_DATABASE_URL,
});

async function updateCodeRules(newRules) {
    try {
        const database = admin.database();
        await database.setRules(newRules);
        console.log("Realtime Database 규칙 업데이트 성공");
    } catch (err) {
        console.error("Realtime Database 규칙 업데이트 오류: ", err);
    }
}

module.exports = {
    updateCodeRules,
};
