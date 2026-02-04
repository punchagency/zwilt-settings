import React from "react";

type CustomPageType = React.FC & {
  useLayout?: boolean;
};

const ConfirmationPage: CustomPageType = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>Invitation Accepted</h1>
      <p>Thank you for accepting the invite. Your status has been updated.</p>
    </div>
  );
};

// Disable layout for this page
ConfirmationPage.useLayout = false;

export default ConfirmationPage;
