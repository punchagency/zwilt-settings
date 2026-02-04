import dynamic from "next/dynamic";

const Notification = dynamic(
  // @ts-ignore
  () => import("remoteApp/nextjs-notification"),
  {
    ssr: false, // Ensure it only works on the client-side
  }
);

const NotificationBox = () => {
  return <Notification />;
};

export default NotificationBox;

// export default () => <></>;
