import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import { ACCEPT_INVITE } from "@/graphql/mutations/manageTeam";
import Loader from "@/components/manageteam/Loader";

// https://settings.zwilt.com/accept-invite?userId=66c4440fc65c15b7ede70d9b

// Define the custom Page type to include the `useLayout` property
type CustomPageType = React.FC & {
  useLayout?: boolean;
};

const AcceptInvitePage: CustomPageType = () => {
  const router = useRouter();
  const { userId } = router.query; // Extract the userId from the URL query parameter

  // GraphQL mutation hook for accepting the invite
  const [acceptInvite, { loading, error }] = useMutation(ACCEPT_INVITE, {
    onCompleted: () => {
      // Handle the successful acceptance, like redirecting to a confirmation page
      // router.push("/confirmation-page");
      setTimeout(() => router.push("/confirmation-page"), 2000);
    },
    onError: (err) => {
      console.error("Error accepting invite:", err.message);
      // Handle error, such as showing a message to the user
    },
  });

  // Automatically trigger the mutation when the component mounts and userId is available
  useEffect(() => {
    if (userId) {
      acceptInvite({
        variables: {
          userId: userId as string, // Use the extracted userId from the URL
        },
      });
    }
  }, [userId, acceptInvite]);

  // Render loading state, error
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {loading && <p>Accepting your invite, please wait...</p>}
      {error && <p>Error: {error.message}</p>}
      {!loading && !error && <Loader />}
    </div>
  );
};

// Disable layout for this page
AcceptInvitePage.useLayout = false;

export default AcceptInvitePage;
