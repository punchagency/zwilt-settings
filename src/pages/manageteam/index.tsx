import React from "react";
import ManageTeam from "@/components/manageteam/ManageTeam";
import ProtectedRoute from "@/components/ProtectedRoute";

const page: React.FC = () => {
  return (
    <ProtectedRoute>
      <ManageTeam />
    </ProtectedRoute>
  );
};

export default page;
