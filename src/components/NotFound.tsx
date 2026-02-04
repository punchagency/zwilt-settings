// import { LuSearchX } from "react-icons/lu";
// interface NotFoundProps {
//     value: string;

//   }

// const NotFound: React.FC<NotFoundProps> = ({ value}) => {

// <div
//                         className="w-full flex bg-white"
//                         style={{
//                           height: `calc(100vh - ${calculatePxToPercentage(
//                             260
//                           )})`,
//                           padding: calculatePxToPercentage(15),
//                           paddingTop: 0,
//                           paddingBottom: calculatePxToPercentage(30),
//                         }}
//                       >
//                         <div
//                           className="w-full h-full flex flex-col justify-center items-center text-center"
//                           style={{
//                             borderRadius: calculatePxToPercentage(10),
//                             gap: calculatePxToPercentage(10),
//                             background: "#F6F6FA",

//                             maxHeight: "45vh",
//                             overflow: "hidden",
//                             height: `calc(100% - ${calculatePxToPercentage(
//                               100
//                             )})`,
//                             marginBottom: calculatePxToPercentage(50),
//                           }}
//                         >
//                           <div
//                             className="flex flex-col items-center justify-center"
//                             style={{
//                               width: "100%",
//                               padding: `${calculatePxToPercentage(24)} 0`,
//                             }}
//                           >
//                             <LuSearchX
//                               style={{
//                                 width: calculatePxToPercentage(54),
//                                 height: calculatePxToPercentage(54),
//                                 color: "#282833",
//                                 opacity: 0.6,
//                                 marginBottom: calculatePxToPercentage(10),
//                               }}
//                             />
//                             <p
//                               style={{
//                                 color: "#282833",
//                                 fontSize: calculatePxToPercentage(24),
//                                 fontWeight: 500,
//                                 lineHeight: calculatePxToPercentage(26.4),
//                                 marginBottom: calculatePxToPercentage(5),
//                                 width: "100%", // Full width for text alignment
//                                 textAlign: "center", // Explicit center alignment
//                               }}
//                             >
//                               Not Found
//                             </p>
//                             <p
//                               style={{
//                                 color: "#282833",
//                                 opacity: 0.4,
//                                 fontSize: calculatePxToPercentage(18),
//                                 fontWeight: 400,
//                                 lineHeight: calculatePxToPercentage(20.19),
//                                 width: "100%", // Full width for text alignment
//                                 textAlign: "center", // Explicit center alignment
//                               }}
//                             >
//                               No result found for{" "}
//                               <span
//                                 style={{
//                                   color: "#282833",
//                                   fontWeight: 600,
//                                   opacity: 0.7,
//                                 }}
//                               >
//                                 “{searchQuery}”
//                               </span>
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                 };

//                 export default NotFound;

import { LuSearchX } from "react-icons/lu";
import { calculatePxToPercentage } from "utils/cssHelper";

interface NotFoundProps {
  searchQuery: string; // Changed from 'value' to match usage
}

const NotFound: React.FC<NotFoundProps> = ({ searchQuery }) => {
  return (
    <div
      className="w-full flex bg-white"
      style={{
        height: `calc(100vh - ${calculatePxToPercentage(260)})`,
        padding: calculatePxToPercentage(15),
        paddingTop: 0,
        paddingBottom: calculatePxToPercentage(30),
      }}
    >
      <div
        className="w-full h-full flex flex-col justify-center items-center text-center"
        style={{
          borderRadius: calculatePxToPercentage(10),
          gap: calculatePxToPercentage(10),
          background: "#F6F6FA",
          maxHeight: "45vh",
          overflow: "hidden",
          marginBottom: calculatePxToPercentage(50),
        }}
      >
        <div
          className="flex flex-col items-center justify-center"
          style={{
            width: "100%",
            padding: `${calculatePxToPercentage(24)} 0`,
          }}
        >
          <LuSearchX
            style={{
              width: calculatePxToPercentage(54),
              height: calculatePxToPercentage(54),
              color: "#282833",
              opacity: 0.6,
              marginBottom: calculatePxToPercentage(10),
            }}
          />
          <p
            style={{
              color: "#282833",
              fontSize: calculatePxToPercentage(24),
              fontWeight: 500,
              lineHeight: calculatePxToPercentage(26.4),
              marginBottom: calculatePxToPercentage(5),
              width: "100%",
              textAlign: "center",
            }}
          >
            Not Found
          </p>
          <p
            style={{
              color: "#282833",
              opacity: 0.4,
              fontSize: calculatePxToPercentage(18),
              fontWeight: 400,
              lineHeight: calculatePxToPercentage(20.19),
              width: "100%",
              textAlign: "center",
            }}
          >
            No result found for{" "}
            <span
              style={{
                color: "#282833",
                fontWeight: 600,
                opacity: 0.7,
              }}
            >
              “{searchQuery}”
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
