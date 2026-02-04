import React from "react";
import NotificationToggle from "../NotificationToggle";

interface ItemsType {
  array: {
    name: string;
    label: string;
    id: string;
    toggled: boolean;
  }[];
  setArray: (id: string) => void;
  description?: string;
  title: string;
}

const NotificationCards: React.FC<ItemsType> = ({ array, setArray, title, description = null }) => {
  return (
    <div>
      <div className='flex w-[26.98vw] justify-between'>
        <div>
          <p className='text-[1.042vw] font-[600]'>{title}</p>
          <p className='font-[400] text-[0.83vw] w-[14.95vw] text-[#6F6F76]'>
            {description ?? 'These are notifications for comments on the profile transcript '}
          </p>
        </div>
        <div className='flex flex-col mt-[0.3vw] gap-[1.75vh]'>
          {array.map((item) => (
            <div
              key={item.id}
              className='flex gap-[0.521vw]'
              style={{ alignItems: "center" }}
            >
              <span onClick={() => setArray(item.id)}>
                <NotificationToggle isToggled={item.toggled} />
              </span>
              <p className='font-[400] text-[0.83vw] text-[#98A2B3]'>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationCards;
