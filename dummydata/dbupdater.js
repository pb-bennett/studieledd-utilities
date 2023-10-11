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

const { parse } = require("csv-parse");

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

const courseArrayFT = [
  "OCT-23-FT",
  "AUG-23-FT",
  "MAR-23-FT",
  "JAN-23-FT",
  "OCT-22-FT",
  "AUG-22-FT",
  "MAR-22-FT",
  "JAN-22-FT",
];
const courseArrayPT = [
  "OCT-23-PT",
  "AUG-23-PT",
  "MAR-23-PT",
  "JAN-23-PT",
  "OCT-22-PT",
  "AUG-22-PT",
  "MAR-22-PT",
  "JAN-22-PT",
];

async function geocodeAddress(address) {
  try {
    const apiKey = "AIzaSyA-UOYryHwUli6saslcccn_RL-Oxlpn67k"; // Replace with your Google API key
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
      const result = data.results[0];
      const location = result.geometry.location;
      const formattedAddress = result.formatted_address;
      // console.log(data.results[0].geometry);
      return {
        coordinates: result.geometry.location,
        address: result.address_components,
      };

      console.log("Formatted Address:", formattedAddress);
      console.log("Latitude:", location.lat);
      console.log("Longitude:", location.lng);
    } else {
      console.error("Geocoding failed:", data.status);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

const collectionRef = collection(db, "users");

const locationsJSON = fs.readFileSync("./locations.json");
const locations = JSON.parse(locationsJSON);
const firstNamesJSON = fs.readFileSync("./firstName.json");
const firstNames = JSON.parse(firstNamesJSON);
const lastNamesJSON = fs.readFileSync("./lastName.json");
const lastNames = JSON.parse(lastNamesJSON);

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};
const locationsShuffle = shuffleArray(locations);
const firstNamesShuffle = shuffleArray(firstNames);
const lastNamesShuffle = shuffleArray(lastNames);

const randomUsers = [];

locationsShuffle.forEach((element, i) => {
  randomUsers.push({
    location: element,
    firstName: firstNamesShuffle[i],
    lastName: lastNamesShuffle[i],
  });
});
// console.log(randomUsers);
// const uniqueLocations = new Set(locations);

// console.log(uniqueLocations);
// const uniqueLocationsArray = Array.from(uniqueLocations).sort();
// const locationsLookup = uniqueLocationsArray.map((element) => {
//   return {
//     location: element,
//   };
// });
// fs.writeFileSync("./locationsLookup.json", JSON.stringify(locationsLookup));
// console.log(locationsLookup);
// const locations = [];
// fs.createReadStream("./locations.csv")
//   .pipe(parse({ delimiter: ",", from_line: 2 }))
//   .on("data", function (row) {
//     locations.push(...row);
//   })
//   .on("end", () => {
//     fs.writeFileSync("./locations.json", JSON.stringify(locations));
//   });
// const firstName = [];
// fs.createReadStream("./firstName.csv")
//   .pipe(parse({ delimiter: ",", from_line: 2 }))
//   .on("data", function (row) {
//     firstName.push(...row);
//   })
//   .on("end", () => {
//     fs.writeFileSync("./firstName.json", JSON.stringify(firstName));
//   });
// const lastName = [];
// fs.createReadStream("./lastName.csv")
//   .pipe(parse({ delimiter: ",", from_line: 2 }))
//   .on("data", function (row) {
//     lastName.push(...row);
//   })
//   .on("end", () => {
//     fs.writeFileSync("./lastName.json", JSON.stringify(lastName));
//   });
// console.log(locations);

// const dummyUsersString = fs.readFileSync("./dummyData.json");
// const dummyUsers = JSON.parse(dummyUsersString);

// const geo = new GeoPoint(60.391262, 5.322054);

// dummyUsers.forEach((user) => (user.geolocation = new GeoPoint(user.geolocation.latitude, user.geolocation.longitude)));
// // console.log(dummyUsers);

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

// getDocs(collectionRef).then((snapshot) => {
//   let users = [];
//   snapshot.docs.forEach((doc) => users.push({ ...doc.data(), id: doc.id }));
//   users.forEach((user) => console.log(user.geolocation._lat));
//   // const usersJson = JSON.stringify(users);
//   // fs.writeFile("dummyData.json", usersJson, "utf-8", () => console.log("written"));
//   // console.log(usersJson);
// });

const locationsLookupJSON = fs.readFileSync("./locationsLookup.json");
const locationsLookup = JSON.parse(locationsLookupJSON);
// console.log(locationsLookup);

const geocodeLocations = async () => {
  try {
    for (const location of locationsLookup) {
      console.log("looking up:", location.location);
      location.geolocation = await geocodeAddress(location.location);
      console.log("-----------------");
    }
    fs.writeFileSync(
      "./locationsLookupFinal.json",
      JSON.stringify(locationsLookup)
    );
    // console.log(locationsLookup);
  } catch (error) {
    console.log(error);
  }
};

const locationLookup = async () => {
  try {
    const locationLookupJSON = fs.readFileSync("./locationsLookupFinal.json");
    const locationLookup = await JSON.parse(locationLookupJSON);
    for (const user of randomUsers) {
      user.geolocation = locationLookup.find((location) => {
        return location.location === user.location;
      });
    }
    // console.log(randomUsers);
  } catch (error) {
    console.log(error);
  }
};
locationLookup();
// geocodeLocations();
// geocodeAddress("tana, finnmark");
