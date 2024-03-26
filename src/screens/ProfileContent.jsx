import React, { useState } from "react";
import { loginRequest } from "../authConfig";
import { callMsGraph, getEvents, workingHours } from "../graph";
import { ProfileData } from "../components/ProfileData";
import { createOrUpdateMeetingWithAutoRecording } from "../graph";
import { useMsal } from "@azure/msal-react";
import Button from "react-bootstrap/Button";
import "../styles/App.css";
import { Spinner } from "../components/Spinner";

export const ProfileContent = () => {
  const { instance, accounts } = useMsal();
  const [graphData, setGraphData] = useState(null);
  const [filterWorkingHours, setFilterWorkingHours] = useState(false);
  const [filterPrivate, setFilterPrivate] = useState(true);
  const [isLoading, setLoading] = useState(false);

  function RequestProfileData() {
    // Silently acquires an access token which is then attached to a request for MS Graph data
    instance
      .acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      })
      .then((response) => {
        callMsGraph(response.accessToken).then((response) =>
          setGraphData(response)
        );
      });
  }

  async function EnableAutoRecording() {
    setLoading(true);
    try {
      const tokenResponse = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });

      const eventsResponse = await getEvents(
        tokenResponse.accessToken,
        filterWorkingHours,
        filterPrivate
      );

      console.log("List of filtered meeting ids:", eventsResponse);
      // Handle meeting data here (e.g., display a message or update the UI)
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="profilePage">
      <h5 className="card-title">Welcome {accounts[0]?.name}</h5>
      <div className="buttonsWrapper">
        <Button variant="secondary" onClick={RequestProfileData}>
          Request Profile Information
        </Button>
        <div className="autoRecordingSection">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="businessHours"
              checked={filterWorkingHours}
              onChange={() =>
                setFilterWorkingHours((currentState) => !currentState)
              }
            />
            <label className="form-check-label" htmlFor="businessHours">
              Between business hours ({workingHours.start} - {workingHours.end})
            </label>
          </div>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="private"
              checked={filterPrivate}
              onChange={() => setFilterPrivate((currentState) => !currentState)}
            />
            <label className="form-check-label" htmlFor="private">
              Private Meetings
            </label>
          </div>
          <Button
            variant="primary"
            onClick={EnableAutoRecording}
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : "Enable Auto-Recording"}
          </Button>
        </div>
      </div>

      {graphData && <ProfileData graphData={graphData} />}
    </section>
  );
};
