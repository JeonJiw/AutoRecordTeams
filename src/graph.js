import { graphConfig } from "./authConfig";

/**
 * Attaches a given access token to a MS Graph API call. Returns information about the user
 * @param accessToken 
 */
export async function callMsGraph(accessToken) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;

    headers.append("Authorization", bearer);

    const options = {
        method: "GET",
        headers: headers
    };

    return fetch(graphConfig.graphMeEndpoint, options)
        .then(response => response.json())
        .catch(error => console.log(error));
}

export async function getEvents(accessToken){
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;
    let meetings = []
    let ids = []
    

    headers.append("Authorization", bearer);
    headers.append("Content-Type", "application/json");

    const options = {
        method: "GET",
        headers: headers
    };

    await fetch("https://graph.microsoft.com/v1.0/me/calendar/events", options)
        .then(response => response.json())
        .then(ret => Array.from(ret.value).forEach(event =>{ if(event.isOnlineMeeting) meetings.push(event.onlineMeeting.joinUrl)}))
        .catch(error => console.log(error))

    await meetings.forEach(m=>fetch("https://graph.microsoft.com/v1.0/me/onlineMeetings?$filter=JoinWebUrl%20eq%20'"+m+"'",options)
                    .then(res => res.json())
                    .then(data => ids.push(data.value[0].id)))
        return ids
}
/*  We dont want to create a new meeting. just modify old ones
export async function createOrUpdateMeetingWithAutoRecording(accessToken) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;

    headers.append("Authorization", bearer);
    headers.append("Content-Type", "application/json");

    const options = {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
            startDateTime: "2022-01-01T14:30:34.2444915-07:00",
            endDateTime: "2022-01-01T15:00:34.2464912-07:00",
            subject: "Your Meeting Subject",
            recordAutomatically: true
        })
    };

    return fetch("https://graph.microsoft.com/v1.0/me/onlineMeetings", options)
        .then(response => response.json())
        .catch(error => console.log(error));
}
*/
