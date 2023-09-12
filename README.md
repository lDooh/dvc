# 화상회의 웹

## Start server
```bash
npm run build
node server.js
```

```bash
docker-compose up
```

## Project setup
+ `.env` file
```env
REACT_APP_API_KEY = 
REACT_APP_AUTH_DOMAIN = 
REACT_APP_DATABASE_URL = 
REACT_APP_PROJECT_ID = 
REACT_APP_STORAGE_BUCKET = 
REACT_APP_MESSAGIN_ID = 
REACT_APP_APP_ID = 

MYSQL_HOST = localhost
# docker-compose 사용 시
# MYSQL_HOST = mysql
MYSQL_PORT = 
MYSQL_USER = 
MYSQL_PASSWORD = 
MYSQL_DATABASE = 
```

### Firebase Admin

+ Firebase Console - 프로젝트 설정 - 서비스 계정
  + 새 비공개 키 생성
  + 다운로드한 파일을 `/keystore` 디렉토리에 옮기기

```js
// src/realtimeDatabaseUtils.js

const admin = require("firebase-admin");
const adminSDKKey = require("../keystore/filename.json");

admin.initializeApp({
    credential: admin.credential.cert(adminSDKKey),
    databaseURL: "https://project-bucket.firebaseio.com/",
});
```