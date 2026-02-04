"use client";
import { signedInDevicesVar } from "@/components/security/state";
import { useReactiveVar } from "@apollo/react-hooks";
import chrome2 from "@/assests/icons/chrome2.svg";
import Safari from "@/assests/icons/Safari.svg";
import edge from "@/assests/icons/edge.svg";
import brave from "@/assests/icons/brave.svg";
import deleteicon from "@/assests/icons/delete.svg";
import { styled, Box } from "@mui/material";
import Skeleton from '@mui/material/Skeleton';
import Image from "next/image";
import { formatTimestamp } from "@/../utils/time";
import { TempGetUser } from "@/graphql/queries/user";
import { REMOVE_DEVICE } from "@/graphql/mutations/settings";
import { useMutation, useLazyQuery, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { calculatePxToPercentage } from "@/../utils/cssHelper";
import axios from "axios";
import useUser from "utils/recoil_store/hooks/use-user-state";
import { BootstrapTooltip } from "@/assests/Tooltip";
import { notifyErrorFxn, notifySuccessFxn } from "../../../utils/toast-fxn";
import { useRecoilValue } from "recoil";
import { userReloadAtom } from "utils/recoil_store/atoms/userAtom";
import Loader from "./Loader";

// Define a type for the fetched IP and location data
interface IpAndLocation {
  ipAddress: string;
  location: string;
}

interface Device {
  browser: string;
  device: string;
  location: string;
  ipAddress: string;
  signInDate: string;
  sessionToken: string;
}


// Function to fetch user's IP address and location
async function fetchUserIpAndLocation(): Promise<IpAndLocation> {
  try {
    const response = await axios.get(
      "https://ipinfo.io/json?token=fb7087013ded88"
    );
    const { ip, city, country } = response.data;
    return {
      ipAddress: ip,
      location: `${city}, ${country}`,
    };
  } catch (error) {
    console.error("Error fetching IP and location:", error);
    return {
      ipAddress: "Unknown",
      location: "Unknown",
    };
  }
}

const Devices = () => {
  const [isLocal, setIsLocal] = useState<boolean>(false);
  const [countryFlags, setCountryFlags] = useState<{ [ip: string]: string }>(
    {}
  );
  const [deviceList, setDeviceList] = useState<Device[]>([]);
  const devices = useReactiveVar(signedInDevicesVar) as Device[];
  const { loading, data, refetch } = useQuery(TempGetUser);
  
  
  //getting user data
  const { userState: userProp } = useUser();
  const userState = userProp?.currentUser;
  

  const [removeDevice, { loading: removeLoading, error: removeError }] =useMutation(REMOVE_DEVICE, {
    onCompleted: () => {
      notifySuccessFxn("Successfull deleted");
      refetch()
    },
    onError: (error) => {
      notifyErrorFxn("Error removing device:" + error.message);

    }
  });


  const [signedIn, setSignedIn] = useState<Device[] | null>(null);

  useEffect(() => {
    console.log(typeof window )
    if (typeof window !== "undefined") {
      setIsLocal(window.location.hostname === "localhost");
    }
  }, []); // This runs only once when the component mounts



  useEffect(() => {
    // setSignedIn(userState?.user?.signedInDevices);
    setSignedIn(data?.getUser?.data?.client?.user?.signedInDevices)
  }, [data]);

  useEffect(() => {
    if (isLocal) {
      // If running locally, use mock data
      console.log("Local")
      fetchUserIpAndLocation().then(
        ({ ipAddress, location }: IpAndLocation) => {
          setDeviceList([
            {
              browser: "Chrome",
              device: "Desktop",
              location: "Unknown",
              ipAddress: "192.168.1.1",
              signInDate: new Date().toISOString(),
              sessionToken: "abc123",
            },
          ]);
        }
      );
    } else {
      // Otherwise, use real data
      console.log("Locall")

      setDeviceList(devices);
    }
  }, [devices, isLocal]); // This runs whenever isLocal or devices changes

  const images: { [key: string]: any } = {
    chrome: chrome2,
    Safari: Safari,
    edge: edge,
    brave: brave,
  };

  function getBrowserKey(browser: string) {
    const info: string = browser.toLowerCase();
    if (info.includes("chrome")) {
      return "chrome";
    } else if (info.includes("edge")) {
      return "edge";
    } else if (info.includes("Safari")) {
      return "Safari";
    } else if (info.includes("brave")) {
      return "brave";
    }
    return null;
  }


 function handleRemove(sessionToken: string) {
   removeDevice({
     variables: {  sessionToken: sessionToken },
   });
    // try {
    //   // Trigger the remove device mutation

    //   if (removeError) notifyErrorFxn(removeError.message);

    //   const { removeSignedInDevice } = data;
    //   if (removeSignedInDevice) {
    //     // Manually update the deviceList state to remove the deleted device
    //     setDeviceList((prevDevices) =>
    //       prevDevices.filter((device) => device.sessionToken !== sessionToken)
    //     );

    //     // Optionally, you can also fetch updated user data
    //     notifySuccessFxn("Successfull deleted");
    //     refetch()
    //   }
    // } catch (error) {
    //   notifyErrorFxn("Error removing device:" + error);
    // }
  }


  useEffect(() => {
    async function fetchCountryFlags() {
      const ipAddresses = deviceList.map((device) => device.ipAddress);
      console.log(ipAddresses)
      const flagUrls: { [ip: string]: string } = {};

      for (const ip of ipAddresses) {
        console.log(ip)
        try {
          const response = await axios.get(`https://ipinfo.io/${ip}/json`);
          const { country } = response.data;
          const flagUrl = `https://countryflagsapi.com/png/${country}`;
          flagUrls[ip] = flagUrl;
        } catch (error) {
          console.error("Error fetching country data:", error);
        }
      }

      setCountryFlags(flagUrls);
    }

    fetchCountryFlags();
  }, [deviceList]);

  const deviceItems = signedIn?.map((device: Device, index: number) => {
    const browserKey = getBrowserKey(device.browser);
    console.log(device.ipAddress)

    const flagUrl = countryFlags[device.ipAddress];

    return (
      <div
        key={index}
        className="grid grid-cols-6 border-b py-[0.8vh] mt-[0.5vw]"
      >
        <div className=" col-span-2 flex items-center gap-[0.83vw]">
          {browserKey && (
            <BrowserImageContainer>
              <Image src={images[browserKey]} alt={`${browserKey} logo`} />
            </BrowserImageContainer>
          )}
          <p className=" text-[0.83vw]">
            {device.browser} on {device.device}
          </p>
        </div>

        <div className=" flex items-center">
          {flagUrl ? (
            <FlagBox>
              <Image
                alt="Country flag"
                src={flagUrl}
                style={{ width: "100%", height: "100%", marginTop: "0.35vw" }}
              />
            </FlagBox>
          ) : (
            ""
          )}
          <p className="mt-[0.1vw] text-[0.83vw]">{device.location}</p>
        </div>

        <div className="flex items-end ">
          <p className=""> {device.ipAddress}</p>
        </div>

        <div className=" flex items-center">
          <p className=" text-gray-400 text-[0.83vw]">
            {formatTimestamp(device.signInDate)}
          </p>
        </div>
        <div
          className="cursor-pointer flex justify-end items-center"
          onClick={() => handleRemove(device.sessionToken)}
        >
          <BootstrapTooltip title="Delete" placement="top">
            <Image
              src={deleteicon}
              alt="delete"
              className=" w-[1.25vw] h-[1.25vw] opacity-[70%] hover:opacity-[100%]"
            />
          </BootstrapTooltip>
        </div>
      </div>
    );
  });

  return (
    
    <Container>
      <div className="flex flex-col gap-[0.2vh]">
        <p className="font-[600] text-[1.042vw] -mt-[0.7vw]">
          Browsers and Devices
        </p>
        <p className="text-[0.83vw] font-[400] text-[#667085] w-[30.63vw]">
          These browsers and devices are currently signed in to your account.
          Remove any unauthorized device.
        </p>
      </div>
     
    {deviceItems}
    </Container>
  );
};

const Container = styled(Box)(({ theme }) => ({
  padding: `${calculatePxToPercentage(40)} ${calculatePxToPercentage(30)}`,
}));

const BrowserImageContainer = styled(Box)(({ theme }) => ({
  width: calculatePxToPercentage(32),
  height: calculatePxToPercentage(32),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const FlagBox = styled(Box)(({ theme }) => ({
  width: calculatePxToPercentage(38),
  height: calculatePxToPercentage(24),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export default Devices;
