import { useRouter } from "next/router";
import { useCallback } from "react";

const useDynamicRouter = () => {
  const navigate = useRouter();

  // Define the router function that can push to a route or be used as the router object
  const router: any = useCallback(
    (...args: any[]) => {
      if (args.length === 0) {
        return navigate; // If no arguments are passed, return the navigate object (useRouter)
      } else {
        // @ts-ignore
        return navigate.push(...args); // If arguments are passed, use navigate.push
      }
    },
    [navigate]
  );

  // Assign the properties of `navigate` (useRouter object) to the router function
  Object.assign(router, navigate);

  return router;
};

export default useDynamicRouter;
