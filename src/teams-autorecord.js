// Importing the necessary MSAL module
import { PublicClientApplication, InteractionType, InteractionStatus } from '@azure/msal-browser';

// MSAL configuration
const msalConfig = {
    auth: {
        clientId: "your-client-id-here", // Update with your client ID
        authority: "https://login.microsoftonline.com/your-tenant-id-here", // Update with your tenant ID
        redirectUri: "your-redirect-uri-here" // Update with your redirect URI
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    }
};

// Create an instance of PublicClientApplication
const msalInstance = new PublicClientApplication(msalConfig);

// Authentication parameters
const loginRequest = {
    scopes: ["openid", "profile", "User.Read", "OnlineMeetings.ReadWrite"] // Add other required scopes here
};

// Function to sign in the user and acquire tokens
async function signIn() {
    try {
        // Attempt to acquire token silently
        const silentResult = await msalInstance.acquireTokenSilent(loginRequest);
        return silentResult.accessToken;
    } catch (error) {
        // If silent acquisition fails, use popup or redirect
        if (error.name === "InteractionRequiredAuthError") {
            try {
                const popupResult = await msalInstance.loginPopup(loginRequest);
                return popupResult.accessToken;
            } catch (popupError) {
                console.error(popupError);
            }
        } else {
            console.error(error);
        }
    }
}

// Function to fetch all meetings
async function getAllMeetings(accessToken) {
    const endpoint = 'https://graph.microsoft.com/v1.0/me/events';
    try {
        const response = await fetch(endpoint, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        const data = await response.json();
        return data.value;
    } catch (error) {
        console.error('Failed to fetch meetings:', error);
        throw error;
    }
}

// Function to enable automatic recording for all meetings
async function enableAutoRecording(accessToken) {
    const endpoint = 'https://graph.microsoft.com/v1.0/meetingsettings';
    try {
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
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to update meeting settings:', error);
        throw error;
    }
}

// Main function to authenticate the user and perform API calls
async function main() {
    try {
        // Sign in the user and get the access token
        const accessToken = await signIn();

        // Fetch all meetings
        const meetings = await getAllMeetings(accessToken);
        console.log('Meetings:', meetings);

        // Enable auto recording for all meetings
        const updatedSettings = await enableAutoRecording(accessToken);
        console.log('Updated Settings:', updatedSettings);
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

// Call the main function
main();
