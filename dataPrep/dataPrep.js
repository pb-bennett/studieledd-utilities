const fs = require("fs");
const { parse } = require("csv-parse");

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

const jsonSetup = () => {
  const locations = [];
  fs.createReadStream("./locations.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
      locations.push(...row);
    })
    .on("end", () => {
      const uniqueLocations = new Set(locations);
      const uniqueLocationsArray = Array.from(uniqueLocations).sort();
      const locationsLookup = uniqueLocationsArray.map((element) => {
        return {
          location: element,
        };
      });
      fs.writeFileSync("./locations.json", JSON.stringify(locations));
      fs.writeFileSync(
        "./locationsLookup.json",
        JSON.stringify(locationsLookup)
      );
    });

  const firstName = [];
  fs.createReadStream("./firstName.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
      firstName.push(...row);
    })
    .on("end", () => {
      fs.writeFileSync("./firstName.json", JSON.stringify(firstName));
    });
  const lastName = [];
  fs.createReadStream("./lastName.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
      lastName.push(...row);
    })
    .on("end", () => {
      fs.writeFileSync("./lastName.json", JSON.stringify(lastName));
    });
};
jsonSetup();

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

const shuffleAllData = () => {
  const locationsShuffle = shuffleArray(
    JSON.parse(fs.readFileSync("./locations.json"))
  );
  const firstNamesShuffle = shuffleArray(
    JSON.parse(fs.readFileSync("./firstName.json"))
  );
  const lastNamesShuffle = shuffleArray(
    JSON.parse(fs.readFileSync("./lastName.json"))
  );
  const randomUsers = [];
  locationsShuffle.forEach((element, i) => {
    randomUsers.push({
      location: element,
      firstName: firstNamesShuffle[i],
      lastName: lastNamesShuffle[i],
    });
  });
  return randomUsers;
};

const randomCourse = () => {
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
  const rand1 = Math.random();
  const rand2 = Math.random();
  if (rand1 < 0.66)
    return courseArrayFT[Math.floor(rand2 * courseArrayFT.length)];
  return courseArrayPT[Math.floor(rand2 * courseArrayFT.length)];
};

const randomUserBuilder = async () => {
  try {
    const shuffledData = shuffleAllData();
    const fullRandomUsers = [];
    for (const user of shuffledData) {
      const geo = await geocodeAddress(user.location);
      // if (!geo) console.log(user);
      const countryObj = geo.address.find((address) =>
        address.types.includes("country")
      );
      // console.log(country);
      fullRandomUsers.push({
        firstName: user.firstName,
        lastName: user.lastName,
        course: randomCourse(),
        geolocation: {
          coordinates: geo.coordinates,
          country: countryObj.long_name,
          location: user.location,
        },
      });
    }
    fs.writeFileSync("./finalUserSet.json", JSON.stringify(fullRandomUsers));
  } catch (error) {
    console.error(error);
  }
};

randomUserBuilder();
