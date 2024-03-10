export const MainContent = () => {
  return (
    <div className="mainContentWrapper">
        <section className="mainContent">
          <div className = "welcome">
            <h3 className="homePageTitle">Seamless Integration, <br/> Effortless Recording</h3>
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
    </div>
  );
};
