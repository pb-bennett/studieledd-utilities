const fs = require("fs");
const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  writeBatch,
  doc,
  GeoPoint,
} = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyCuhuyi-IWAhbbDQYx87IwkVbS6K07iDR0",
  authDomain: "studieledd.firebaseapp.com",
  projectId: "studieledd",
  storageBucket: "studieledd.appspot.com",
  messagingSenderId: "147272146538",
  appId: "1:147272146538:web:0ae8762725ac4871e13413",
  measurementId: "G-RG9YKM2PG6",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const collectionRef = collection(db, "users");

const userGeoPointMaker = (user) => {
  return new GeoPoint(
    user.geolocation.coordinates.lat,
    user.geolocation.coordinates.lng
  );
};

const updateDB = async () => {
  try {
    const finalUserSetJSON = fs.readFileSync("./finalUserSet.json");
    const finalUserSet = JSON.parse(finalUserSetJSON);
    finalUserSet.forEach((user) => {
      user.geolocation.coordinates = userGeoPointMaker(user);
    });
    // console.log(finalUserSet);
    const batch = writeBatch(db);
    finalUserSet.forEach((user) => {
      const docRef = doc(collectionRef);
      batch.set(docRef, user);
    });
    batch
      .commit()
      .then(() => {
        console.log("upload success");
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (error) {
    console.error(error);
  }
};
updateDB();

// getDocs(collectionRef).then((snapshot) => {
//   let users = [];
//   snapshot.docs.forEach((doc) => users.push({ ...doc.data(), id: doc.id }));
//   console.log(users);
//   //   users.forEach((user) => console.log(user.geolocation._lat));
//   // const usersJson = JSON.stringify(users);
//   // fs.writeFile("dummyData.json", usersJson, "utf-8", () => console.log("written"));
//   // console.log(usersJson);
// });
