import React, { useState } from "react";
import { loginRequest } from "../authConfig";
import { callMsGraph } from "../graph";
import { ProfileData } from "../components/ProfileData";
import { createOrUpdateMeetingWithAutoRecording } from "../graph";
import { useMsal } from "@azure/msal-react";
import Button from "react-bootstrap/Button";
import "../styles/App.css";

export const ProfileContent = () => {
  const { instance, accounts } = useMsal();
  const [graphData, setGraphData] = useState(null);

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

  function EnableAutoRecording() {
    instance
      .acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      })
      .then((response) => {
        createOrUpdateMeetingWithAutoRecording(response.accessToken).then(
          (meetingData) => {
            console.log("Meeting Created with Auto-Recording:", meetingData);
            // Handle meeting data here (e.g., display a message or update the UI)
          }
        );
      });
  }

  return (
    <section className="profilePage">
      <h5 className="card-title">Welcome {accounts[0]?.name}</h5>
      <div>
        <Button variant="secondary" onClick={RequestProfileData}>
          Request Profile Information
        </Button>
        <Button
          variant="primary"
          onClick={EnableAutoRecording}
          style={{ marginLeft: "10px" }}
        >
          Enable Auto-Recording
        </Button>
      </div>

      {graphData && <ProfileData graphData={graphData} />}
    </section>
  );
};
