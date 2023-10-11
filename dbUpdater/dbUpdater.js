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

// dummyUsers.forEach(
//   (user) =>
//     (user.geolocation = new GeoPoint(
//       user.geolocation.latitude,
//       user.geolocation.longitude
//     ))
// );

// const batch = writeBatch(db);
// dummyUsers.forEach((user) => {
//   const docRef = doc(collectionRef);
//   batch.set(docRef, user);
// });
// batch
//   .commit()
//   .then(() => {
//     console.log("upload success");
//   })
//   .catch((error) => {
//     console.error(error);
//   });

getDocs(collectionRef).then((snapshot) => {
  let users = [];
  snapshot.docs.forEach((doc) => users.push({ ...doc.data(), id: doc.id }));
  console.log(users);
  //   users.forEach((user) => console.log(user.geolocation._lat));
  // const usersJson = JSON.stringify(users);
  // fs.writeFile("dummyData.json", usersJson, "utf-8", () => console.log("written"));
  // console.log(usersJson);
});
