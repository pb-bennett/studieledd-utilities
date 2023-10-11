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

// Usage example:
// const address = "Sandefjord";
// geocodeAddress(address);
