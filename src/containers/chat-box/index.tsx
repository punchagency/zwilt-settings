import { useRouter } from "next/router";
import { lazy, Suspense } from "react";
// import "@/styles/switzer.css";
import useDynamicRouter from "@/hooks/dynamicRouter/useDynamicRouter";
import dynamic from "next/dynamic";
// import SpinnerBig from '../../components/SpinnerBig';
// @ts-ignore

const ChatComponent = dynamic(
  () =>
    // @ts-ignore
    import("remoteApp/nextjs-chat").catch((err) => {
      console.warn("Failed to load federated component nextjs-chat:", err);
      return () => null;
    }),
  {
    ssr: false, // Ensure it only works on the client-side
  }
);

const ChatB = () => {
  const router = useDynamicRouter();
  return (
    // <Suspense
    //   fallback={
    //     <div>loading...</div>
    //     // <SpinnerBig big />
    //   }
    // >
    // @ts-ignore
    <ChatComponent router={router} />
    // </Suspense>
  );
};
// export default () => <></>;
export default ChatB;
