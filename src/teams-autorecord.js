// Importing the necessary MSAL module
import { ConfidentialClientApplication } from "@azure/msal-node";

// Configuring MSAL with your client application credentials
const config = {
  auth: {
    clientId: "ab325777-984e-4149-a303-d627bdca944f", // Update with your client ID
    authority:
      "https://login.microsoftonline.com/c2628eb9-57bf-48f2-b0e6-84319d472735", // Update with your tenant ID
    clientSecret: "JGe8Q~9W8kvf2iilgLp1FgYDQgxSafZMa6pgEbRW", // Update with your client secret
  },
};

// Create an instance of ConfidentialClientApplication
const msalInstance = new ConfidentialClientApplication(config);

// Authentication parameters
const tokenRequest = {
  scopes: ["api://ab325777-984e-4149-a303-d627bdca944f/.default"], // Add other required scopes here
};

// Function to acquire tokens using client credentials
async function acquireToken() {
  try {
    const authResponse = await msalInstance.acquireTokenByClientCredential(
      tokenRequest
    );
    const accessToken = authResponse.accessToken;
    return accessToken;
  } catch (error) {
    console.error("Error acquiring token:", error);
    throw error;
  }
}

// Function to fetch all meetings
async function getAllMeetings(accessToken) {
  try {
    const endpoint = "https://graph.microsoft.com/v1.0/me/events";

    // Making the API call to fetch all meetings
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status >= 400) {
      console.log(await response.json());
      throw new Error();
    }
    // Parsing the JSON response
    const data = await response.json();

    // Returning the list of meetings
    return data.value;
  } catch (err) {
    console.error("Error getting all meetings");
  }
}

// Defining the function to enable automatic recording for all meetings in the client's tenant

async function enableAutoRecording(accessToken) {
  try {
    const endpoint = "https://graph.microsoft.com/v1.0/meetingsettings";

    // Making the API call to enable automatic recording settings
    const response = await fetch(endpoint, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        allowCloudRecording: true,
        automaticRecordAllMeetings: true,
      }),
    });

    if (response.status > 400) {
      console.log(await response.json());
      throw new Error();
    }
    // Parsing the JSON response
    const data = await response.json();
    // Returning the updated meeting settings
    return data;
  } catch (err) {
    console.error("Error Enabling auto recording");
  }
}

// Creating a main function to authenticate the user and use the above functions

// Example usage

async function main() {
  try {
    // Acquire the access token using client credentials
    const accessToken = await acquireToken();

    // Fetch all meetings
    const meetings = await getAllMeetings(accessToken);

    // Enable auto recording for all meetings
    const updatedSettings = await enableAutoRecording(accessToken);

    // Print the updated meeting settings
    console.log(updatedSettings);
  } catch (error) {
    console.log("An error occurred:", error);
  }
}

main();
