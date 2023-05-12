// It will contain most of the logic for fetching the data from each API endpoint.

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
*/
const request = require('request');

const fetchMyIP = function(callback) {
  request("https://api.ipify.org?format=json", function(error, response, body) {
    if (error) {
      callback(error, null);
      return;
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    
    callback(error, JSON.parse(body).ip);
  });
};



const fetchCoordsByIP = function(ip, callback) {
  request(`http://ipwho.is/${ip}`, function(error, response, body) {
    if (error) {
      callback(error, null);
      return;
    }
    const parsedBody = JSON.parse(body);
    if (!parsedBody.success) {
      const msg = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
      callback(Error(msg), null);
      return;
    }
    
    const geoLoc = { latitude: parsedBody.latitude, longitude: parsedBody.longitude};
    callback(error, geoLoc);
  });
};


module.exports = { fetchMyIP, fetchCoordsByIP };