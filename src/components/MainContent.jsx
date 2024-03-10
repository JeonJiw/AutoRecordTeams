import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import { ProfileContent } from "./ProfileContent";

export const MainContent = () => {
  return (
    <div className="mainContentWrapper">
      <AuthenticatedTemplate>
        <ProfileContent />
      </AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <section className="mainContent">
          <div className = "welcome">
            <h3>Seamless Integration, <br/> Effortless Recording</h3>
            <p>
              AutoRecord Teams allows you to take control of your Teams meetings <br/>
              with the ability to auto-record, ensuring that important
              discussions, decisions, <br/> and insights are never lost.
            </p>
          </div>
          <div className="welcomePicture">
            <img src="/res/meeting.jpg" alt="meeting"/>
          </div>
        </section>
      </UnauthenticatedTemplate>
    </div>
  );
};
