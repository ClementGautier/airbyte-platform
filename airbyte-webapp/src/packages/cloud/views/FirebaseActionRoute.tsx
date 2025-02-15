import React from "react";
import { useIntl } from "react-intl";
import { Navigate, useNavigate } from "react-router-dom";
import { useAsync } from "react-use";
import { match } from "ts-pattern";

import { PageTrackingCodes, useTrackPage } from "hooks/services/Analytics";
import { useNotificationService } from "hooks/services/Notification";
import { useQuery } from "hooks/useQuery";
import { useAuthService } from "packages/cloud/services/auth/AuthService";

import { LoginSignupNavigation } from "./auth/components/LoginSignupNavigation";
import { CloudRoutes } from "../cloudRoutePaths";

const AcceptEmailInvite = React.lazy(() => import("./AcceptEmailInvite"));
const ResetPasswordConfirmPage = React.lazy(() => import("./auth/ConfirmPasswordResetPage"));
const LoadingPage = React.lazy(() => import("components/LoadingPage"));

export enum FirebaseActionMode {
  VERIFY_EMAIL = "verifyEmail",
  RESET_PASSWORD = "resetPassword",
  SIGN_IN = "signIn",
}

export const VerifyEmailAction: React.FC = () => {
  const query = useQuery<{ mode?: FirebaseActionMode; oobCode?: string }>();
  const { verifyEmail } = useAuthService();
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const { registerNotification } = useNotificationService();

  useTrackPage(PageTrackingCodes.VERIFY_EMAIL);
  useAsync(async () => {
    if (query.mode === FirebaseActionMode.VERIFY_EMAIL) {
      if (!query.oobCode) {
        return;
      }
      // Send verification code to authentication service
      await verifyEmail(query.oobCode);
      // Show a notification that the mail got verified successfully
      registerNotification({
        id: "auth/email-verified",
        text: formatMessage({ id: "verifyEmail.notification" }),
        type: "success",
      });
      // Navigate the user to the homepage
      navigate("/");
    }
  }, []);

  // Only render the loading screen if we're verifying an email otherwise don't render anything,
  // since password reset is handled in a different place.
  return query.mode === FirebaseActionMode.VERIFY_EMAIL ? <LoadingPage /> : null;
};

export const FirebaseActionRoute: React.FC = () => {
  const { mode } = useQuery<{ mode: FirebaseActionMode }>();

  return (
    <>
      {match(mode)
        .with(FirebaseActionMode.VERIFY_EMAIL, () => <VerifyEmailAction />)
        .with(FirebaseActionMode.SIGN_IN, () => <AcceptEmailInvite />)
        .with(FirebaseActionMode.RESET_PASSWORD, () => <ResetPasswordConfirmPage />)
        .otherwise(() => (
          <Navigate to={CloudRoutes.Login} replace />
        ))}
      <LoginSignupNavigation to="login" />
    </>
  );
};
