/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Loader from "../Components/Loader";
import { Suspense, lazy } from "react";
const EditProfile = lazy(() =>
  import("../Pages/AuthenticationPage/EditProfile")
);
const ProfileView = lazy(() => import("../Pages/ProfileView"));
const PassUpdate = lazy(() => import("../Pages/AuthenticationPage/PassUpdate"));
const PasswordChangeSuccess = lazy(() =>
  import("../Pages/AuthenticationPage/PasswordChangeSuccess")
);
const ErrorPage = lazy(() => import("../Pages/ErrorPage"));
const SignInPage = lazy(() => import("../Pages/AuthenticationPage/SignInPage"));
const SignUpPage = lazy(() => import("../Pages/AuthenticationPage/SignUpPage"));
const HomePage = lazy(() => import("../Pages/HomePage"));
const ContactPage = lazy(() => import("../Pages/Contact"));
const PrivacyPolicy = lazy(() => import("../Pages/PrivacyPolicy"));
const AboutPage = lazy(() => import("../Pages/About"));
const ContactSuccessPage = lazy(() => import("../Pages/ContactSuccess"));
const GoogleCallback = lazy(() =>
  import("../Pages/AuthenticationPage/Callback")
); // Import the callback component

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<Loader />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: "/profile/edit-profile",
        element: (
          <Suspense fallback={<Loader />}>
            <EditProfile />
          </Suspense>
        ),
      },
      {
        path: "/profile/view-profile",
        element: (
          <Suspense fallback={<Loader />}>
            <ProfileView />
          </Suspense>
        ),
      },
      {
        path: "/profile/edit-profile/password-change",
        element: (
          <Suspense fallback={<Loader />}>
            <PassUpdate />
          </Suspense>
        ),
      },
      {
        path: "/profile/edit-profile/change-password/change-successfully",
        element: (
          <Suspense fallback={<Loader />}>
            <PasswordChangeSuccess />
          </Suspense>
        ),
      },
      {
        path: "/contact",
        element: (
          <Suspense fallback={<Loader />}>
            <ContactPage />
          </Suspense>
        ),
      },
      {
        path: "/thank-you",
        element: (
          <Suspense fallback={<Loader />}>
            <ContactSuccessPage />
          </Suspense>
        ),
      },
      {
        path: "/about",
        element: (
          <Suspense fallback={<Loader />}>
            <AboutPage />
          </Suspense>
        ),
      },
      {
        path: "/privacy-policy",
        element: (
          <Suspense fallback={<Loader />}>
            <PrivacyPolicy />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/error",
    element: (
      <Suspense fallback={<Loader />}>
        <ErrorPage />
      </Suspense>
    ),
  },
  {
    path: "/sign-in",
    element: (
      <Suspense fallback={<Loader />}>
        <SignInPage />
      </Suspense>
    ),
  },
  {
    path: "/sign-up",
    element: (
      <Suspense fallback={<Loader />}>
        <SignUpPage />
      </Suspense>
    ),
  },
  {
    path: "/pass-update",
    element: (
      <Suspense fallback={<Loader />}>
        <PassUpdate />
      </Suspense>
    ),
  },
  {
    path: "/auth/success",
    element: (
      <Suspense fallback={<Loader />}>
        <GoogleCallback />
      </Suspense>
    ),
  },
]);
