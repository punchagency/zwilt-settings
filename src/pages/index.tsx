import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Preserve query parameters (especially token) when redirecting
  const queryString = new URLSearchParams(context.query as Record<string, string>).toString();
  const destination = queryString ? `/user?${queryString}` : "/user";

  return {
    redirect: {
      destination,
      permanent: false,
    },
  };
};

const Home = () => {
  return null;
};

export default Home;
