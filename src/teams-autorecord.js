const msal = require('msal');

// Configuring MSAL with your client application credentials
const config = {
    auth: {
        clientId: 'v.phan@BVCITPTeamsRecordingProject.onmicrosoft.com',
        authority: 'https://login.microsoftonline.com/c2628eb9-57bf-48f2-b0e6-84319d472735'
    }
};

// Creating a new MSAL client application
const clientApp = new msal.PublicClientApplication(config);

// Defining the function to fetch all meetings in the client's tenant

async function getAllMeetings(accessToken) {
    const endpoint = 'https://graph.microsoft.com/v1.0/me/events';

    // Making the API call to fetch all meetings
    const response = await fetch(endpoint, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    // Parsing the JSON response
    const data = await response.json();

    // Returning the list of meetings
    return data.value;
}

// Defining the function to enable automatic recording for all meetings in the client's tenant

async function enableAutoRecording(accessToken) {
    const endpoint = 'https://graph.microsoft.com/v1.0/meetingsettings';

    // Making the API call to enable automatic recording settings
    const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            allowCloudRecording: true,
            automaticRecordAllMeetings: true
        })
    });

    // Parsing the JSON response
    const data = await response.json();

    // Returning the updated meeting settings
    return data;
}

// Creating a main function to authenticate the user and use the above functions

// Example usage

async function main() {
    try {
        // Authenticate the user and obtain the access token
        const authResponse = await clientApp.loginPopup();

        // Fetch all meetings
        const meetings = await getAllMeetings(authResponse.accessToken);

        // Enable auto recording for all meetings
        const updatedSettings = await enableAutoRecording(authResponse.accessToken);

        // Print the updated meeting settings
        console.log(updatedSettings);
    } catch (error) {
        console.log('An error occurred:', error);
    }
}

main();
