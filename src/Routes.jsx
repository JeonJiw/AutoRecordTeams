import { Route, Routes, BrowserRouter } from "react-router-dom";
import { MainContent } from "./screens/MainContent";
import { ProfileContent } from "./screens/ProfileContent";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthenticatedTemplate>
        <Routes>
          <Route path="*" element={<ProfileContent />} />
        </Routes>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Routes>
          <Route path="*" element={<MainContent />} />
        </Routes>
      </UnauthenticatedTemplate>
    </BrowserRouter>
  );
}
