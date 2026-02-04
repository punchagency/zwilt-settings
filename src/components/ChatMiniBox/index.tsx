import dynamic from "next/dynamic";

const ChatMiniBoxComponent = dynamic(
  // @ts-ignore
  () => import("remoteApp/nextjs-chat-minibox"),
  {
    ssr: false, // Ensure it only works on the client-side
  }
);

const ChatMini = () => {
  return <ChatMiniBoxComponent />;
};

export default ChatMini;

// export default () => <></>;
