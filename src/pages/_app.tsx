// import AppLayout from "@/containers/layout";
// import { TempGetUser } from "@/graphql/queries/user";
import useApollo from "@/hooks/useApollo";
// import { initializeApollo } from "@/lib/with-apollo";
import "@/styles/billingsummary.css";
import "@/styles/companyprofile.css";
import "@/styles/globals.css";
import "@/styles/interview.css";
import "@/styles/invoice.css";
import "@/styles/notification.css";
import "@/styles/payment.css";
import "@/styles/switzer.css";
import { ApolloProvider } from "@apollo/client";
import { NextPage } from "next";
import type {
  // AppContext, AppInitialProps,
  AppProps,
} from "next/app";
// import App from "next/app";
import Head from "next/head";
import { RecoilRoot } from "recoil";
import "tailwindcss/tailwind.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthGuard from "@/containers/layout/AuthGuard";

type Page<P = {}> = NextPage<P> & {
  requireAuth?: boolean;
};

interface AppPropsExtended {
  Component?: Page;
  // currentUser: any;
  // userId: string;
}

function ZwiltApp({
  Component,
  pageProps,
}: // currentUser,
// userId,
AppProps & AppPropsExtended) {
  const client = useApollo(pageProps);

  return (
    <div>
      <>
        <Head>
          <title>Zwilt Settings</title>
          <meta name='description' content='Zwilt settings' />
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <meta charSet='UTF-8' />
          <link rel='icon' href='/Favicon.ico' sizes='any' />
          <link rel='icon' href='/icon-192x192.png' sizes='192x192' />
          <link rel='icon' href='/icon-512x512.png' sizes='512x512' />
        </Head>

        <RecoilRoot>
          <ApolloProvider client={client}>
            <AuthGuard>
              <ToastContainer />
              <Component {...pageProps} />
            </AuthGuard>
            {/* {(() => {
              if (currentUser) {
                return (
                  <AppLayout currentUser={currentUser}>
                    <ToastContainer />
                    <Component {...pageProps} />
                  </AppLayout>
                );
              } else {
                // if (typeof window !== "undefined") {
                //   window.location.href = `${process.env.NEXT_PUBLIC_STORE_APP}/auth/signin?v=account&r=settings`;
                // }
                return null;
              }
            })()} */}
          </ApolloProvider>
        </RecoilRoot>
      </>
    </div>
  );
}

// ZwiltApp.getInitialProps = async (
//   context: AppContext
// ): Promise<AppPropsExtended & AppInitialProps> => {
//   const ctx = await App.getInitialProps(context);
//   const client = initializeApollo(null, context.ctx?.req?.headers);
//   console.log("app cookie", context.ctx?.req?.headers?.cookie);
//   let currentUser = null;
//   try {
//     const data: any = await client.query({
//       query: TempGetUser,
//       fetchPolicy: "network-only",
//     });
//     currentUser = data?.data?.getUser?.data?.client;
//     console.log("currentUser", currentUser);
//   } catch (error) {
//     console.log("error", error);
//   }
//   return {
//     ...ctx,
//     currentUser,
//     // @ts-ignore
//     appCookie: context.ctx?.req?.headers?.cookie,
//     reqHeader: context.ctx?.req?.headers,
//   };
// };

export default ZwiltApp;
