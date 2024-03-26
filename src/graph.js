import { graphConfig } from "./authConfig";
import { utcToZonedTime } from "date-fns-tz";

export const workingHours = { start: "08:00", end: "17:00" };
const clientTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const utcIdentifier = "Z"; //zulu time, same as UTC

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
    headers: headers,
  };

  return fetch(graphConfig.graphMeEndpoint, options)
    .then((response) => response.json())
    .catch((error) => console.log(error));
}

export async function getEvents(
  accessToken,
  filterWorkingHours,
  filterPrivate
) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;
  let meetings = [];
  const onlineMeetings = [];

  headers.append("Authorization", bearer);
  headers.append("Content-Type", "application/json");

  const options = {
    method: "GET",
    headers: headers,
  };

  await fetch("https://graph.microsoft.com/v1.0/me/calendar/events", options)
    .then((response) => response.json())
    .then((ret) =>
      Array.from(ret.value).forEach((event) => {
        if (event.isOnlineMeeting) {
          const joinUrl = event.onlineMeeting.joinUrl;
          if (filterWorkingHours && filterPrivate) {
            if (
              isBetweenWorkingHours(
                `${event.start.dateTime}${utcIdentifier}` &&
                  event.sensitivity != "private"
              )
            ) {
              meetings.push(joinUrl);
            }
          } else if (filterWorkingHours && !filterPrivate) {
            if (
              isBetweenWorkingHours(`${event.start.dateTime}${utcIdentifier}`)
            ) {
              meetings.push(joinUrl);
            }
          } else if (!filterWorkingHours && filterPrivate) {
            if (event.sensitivity != "private") {
              meetings.push(joinUrl);
            }
          } else {
            meetings.push(joinUrl);
          }
        }
      })
    )
    .catch((error) => console.log(error));

  const onlineMettingsPromises = meetings.map((m) => {
    const joinWebUrlFilter = encodeURIComponent(`JoinWebUrl eq '${m}'`);
    return fetch(
      `https://graph.microsoft.com/v1.0/me/onlineMeetings?$filter=${joinWebUrlFilter}`,
      options
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.value[0]) {
          const meeting = data.value[0];
          onlineMeetings.push(meeting);
        }
      });
  });
  await Promise.all(onlineMettingsPromises).catch((e) => console.error(e));
  return onlineMeetings;
}

function getDateWorkingHours(startDateTime, hourOverride) {
  const date = new Date(startDateTime);
  const [hour, minutes] = hourOverride.split(":");
  date.setHours(hour);
  date.setMinutes(minutes);
  date.setSeconds(0);
  return date;
}

function isBetweenWorkingHours(startDateTime) {
  const startWorkingHourDate = getDateWorkingHours(
    startDateTime,
    workingHours.start
  );
  const endWorkingHourDate = getDateWorkingHours(
    startDateTime,
    workingHours.end
  );
  const zonedMettingStartDate = utcToZonedTime(startDateTime, clientTimeZone);
  if (
    zonedMettingStartDate.getTime() >= startWorkingHourDate.getTime() &&
    zonedMettingStartDate.getTime() < endWorkingHourDate.getTime()
  ) {
    return true;
  }
  return false;
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
