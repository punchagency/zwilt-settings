import { apiUrl } from "@/config/apiUrl";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloLink,
} from "@apollo/client";
import merge from "deepmerge";
import isEqual from "lodash-es/isEqual";
// import { NormalizedCacheObject } from "@apollo/react-hooks";
import { IncomingMessage } from "http";
import { GetStaticPropsContext, NextPageContext } from "next";

export interface CustomGetStaticPropsContext extends GetStaticPropsContext {
  req: {
    headers: IncomingMessage["headers"];
  };
  [key: string]: any;
}

export interface CustomPageContext extends NextPageContext {
  pageProps: {
    [key: string]: any; // add any additional properties needed here
  };
}

let apolloClient: ApolloClient<any> | null;

export const APOLLO_STATE_PROP_NAME = "__APOLLO_STATE__";

const aiCreditsUrl =
  process.env.NEXT_PUBLIC_ZWILT_SERVER || "https://api.zwilt.com/graphql";

function createApolloClient(headers?: any) {
  const httpLink = new HttpLink({
    uri: `${apiUrl}/graphql`,
    fetch,
    credentials: "include",
    headers,
  });

  const aiCreditsLink = new HttpLink({
    uri: aiCreditsUrl,
    fetch,
    credentials: "include",
    headers,
  });

  const splitLink = ApolloLink.split(
    (operation: any) => operation.getContext().clientName === "aiCredits",
    aiCreditsLink,
    httpLink,
  );

  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: splitLink,
    headers,
    cache: new InMemoryCache(),
  });
}

export function initializeApollo(
  initialState?: any,
  headers?: CustomGetStaticPropsContext["req"]["headers"],
) {
  const _apolloClient = apolloClient ?? createApolloClient(headers);
  if (initialState) {
    const existingCache = _apolloClient.cache.extract();

    const data = merge(initialState, existingCache, {
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) =>
          sourceArray.every((s) => !isEqual(d, s)),
        ),
      ],
    });
    _apolloClient.cache.restore(data);
  }

  if (typeof window === "undefined") {
    return _apolloClient;
  }

  if (!apolloClient) {
    apolloClient = _apolloClient;
  }

  return _apolloClient;
}

export function addApolloState(client: ApolloClient<any>, pageProps: any) {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }

  return pageProps;
}
