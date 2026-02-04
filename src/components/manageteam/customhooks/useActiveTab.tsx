import { useState } from "react";

const useActiveTab = (initialTab: string) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  return {
    activeTab,
    setActiveTab,
  };
};

export default useActiveTab;
