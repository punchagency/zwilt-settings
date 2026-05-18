import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/dashboard",
      permanent: false,
    },
  };
};

const UserManagementPage = () => {
  return null;
};

export default UserManagementPage;
