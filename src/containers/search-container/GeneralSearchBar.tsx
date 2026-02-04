import React, { useEffect, useState, useRef, useCallback } from "react";
import SearchIcon from "@/assests/icons/search-icon.svg";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import EmailSearch from "./EmailSearch";
import UserSearch from "./UserSearch";
import TeamSearch from "./TeamSearch";
import SecuritySearch from "./SecuritySearch";
import CompanySearch from "./CompanySearch";
import PaymentSearch from "./PaymentSearch";
import PhoneSearch from "./PhoneSearch";
import InterviewSearch from "./InterviewSearch";
import NotificationSearch from "./NotificationSearch";
import SuppportSearch from "./SupportSearch";
import { useMutation, useQuery } from "@apollo/client";
import { DeleteRecentSearch, RecentSearches } from "@/graphql/queries/search";
import { CiSearch } from "react-icons/ci";
import { LuSearchX } from "react-icons/lu";
import { SAVE_SETTINGS } from "@/graphql/mutations/search";
import { calculatePxToPercentage } from "utils/cssHelper";
import NotFound from "@/components/NotFound";

interface searchProp {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  isFocus: boolean;
  setIsFocus: React.Dispatch<React.SetStateAction<boolean>>;
}

interface RecentSearch {
  _id: string;
  searchTerm: string;
  timestamp: number;
  createdAt?: number;
}

const RECENT_SEARCHES_KEY = "zwilt_recent_searches";
const MAX_RECENT_SEARCHES = 10;

const GeneralSearchBar: React.FC<searchProp> = ({
  searchQuery,
  setSearchQuery,
  isFocus,
  setIsFocus,
}) => {
  // Initialize all state and refs first
  const [localRecentSearches, setLocalRecentSearches] = useState<
    RecentSearch[]
  >([]);
  const [searcArray, setSearchArray] = useState<any[] | null>(null);
  const [companyEmpty, setCompanyEmpty] = useState(true);
  const [interviewEmpty, setInterviewEmpty] = useState(true);
  const [notificationEmpty, setNotiicationEmpty] = useState(true);
  const [paymentEmpty, setPaymentEmpty] = useState(true);
  const [phoneEmpty, setPhoneEmpty] = useState(true);
  const [securityEmpty, setSecurityEmpty] = useState(true);
  const [emailEmpty, setEmailEmpty] = useState(true);
  const [teamEmpty, setTeamEmpty] = useState(true);
  const [userEmpty, setUserEmpty] = useState(true);
  const [generalEmpty, setGeneralEmpty] = useState(true);
  const [loadingResults, setLoadingResults] = useState(true);
  const [showFullSearch, setShowFullSearch] = useState(false);
  const [isClient, setIsClient] = useState(false); // Add client-side check

  const searchModalRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Check if we're on client side (Next.js SSR fix)
  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data, loading, error, refetch } = useQuery(RecentSearches, {
    variables: { appType: "SETTINGS" },
  });

  const [saveRecentSearch] = useMutation(SAVE_SETTINGS, {
    onCompleted: () => {
      console.log("save successfully");
      refetch();
    },
    onError: (error) => {
      console.error("Save search error:", error);
    },
  });

  const [deleteRecentSearch] = useMutation(DeleteRecentSearch, {
    onCompleted: () => {
      console.log("deleted successfully");
      refetch();
    },
    onError: (error) => {
      console.error("Delete search error:", error);
    },
  });

  // Enhanced storage utility functions with better error handling
  const getStoredSearches = useCallback((): RecentSearch[] => {
    // Don't access localStorage during SSR
    if (!isClient || typeof window === "undefined") {
      return [];
    }

    try {
      // Check if localStorage is available
      if (typeof Storage === "undefined") {
        console.warn("localStorage is not supported");
        return [];
      }

      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validate the structure of stored data
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (item) =>
              item &&
              typeof item === "object" &&
              item._id &&
              item.searchTerm &&
              typeof item.searchTerm === "string"
          );
        }
      }

      // Fallback to sessionStorage
      const sessionStored = sessionStorage.getItem(RECENT_SEARCHES_KEY);
      if (sessionStored) {
        const parsed = JSON.parse(sessionStored);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (item) =>
              item &&
              typeof item === "object" &&
              item._id &&
              item.searchTerm &&
              typeof item.searchTerm === "string"
          );
        }
      }

      return [];
    } catch (error) {
      console.error("Error retrieving stored searches:", error);
      // Clear corrupted data
      try {
        localStorage.removeItem(RECENT_SEARCHES_KEY);
        sessionStorage.removeItem(RECENT_SEARCHES_KEY);
      } catch (clearError) {
        console.error("Error clearing corrupted storage:", clearError);
      }
      return [];
    }
  }, [isClient]);

  const saveToStorage = useCallback(
    (searches: RecentSearch[]) => {
      // Don't access localStorage during SSR
      if (!isClient || typeof window === "undefined") {
        return;
      }

      try {
        // Check if localStorage is available
        if (typeof Storage === "undefined") {
          console.warn("localStorage is not supported");
          return;
        }

        // Validate data before storing
        if (!Array.isArray(searches)) {
          console.error("Invalid data type for searches:", typeof searches);
          return;
        }

        const searchesToStore = JSON.stringify(searches);

        // Check if we can actually write to localStorage
        localStorage.setItem(RECENT_SEARCHES_KEY, searchesToStore);

        // Also save to sessionStorage as backup
        sessionStorage.setItem(RECENT_SEARCHES_KEY, searchesToStore);

        console.log(`Saved ${searches.length} searches to storage`);
      } catch (error) {
        console.error("Error saving searches to storage:", error);

        // If localStorage is full, try to clear some space
        if ((error as Error).name === "QuotaExceededError") {
          try {
            // Remove old entries and try again with fewer items
            const reducedSearches = searches.slice(
              0,
              Math.floor(MAX_RECENT_SEARCHES / 2)
            );
            localStorage.setItem(
              RECENT_SEARCHES_KEY,
              JSON.stringify(reducedSearches)
            );
            console.warn("Storage quota exceeded, saved reduced set");
          } catch (retryError) {
            console.error("Even reduced storage failed:", retryError);
          }
        }
      }
    },
    [isClient]
  );

  // Enhanced add recent search function
  const addRecentSearch = useCallback(
    (searchTerm: string) => {
      if (!searchTerm || !searchTerm.trim()) {
        console.warn("Empty search term provided");
        return;
      }

      const trimmedTerm = searchTerm.trim();

      setLocalRecentSearches((prevSearches) => {
        try {
          const newSearch: RecentSearch = {
            _id: `local-${Date.now()}-${Math.random()
              .toString(36)
              .slice(2, 11)}`,
            searchTerm: trimmedTerm,
            timestamp: Date.now(),
          };

          // Remove duplicates (case-insensitive)
          const filteredSearches = prevSearches.filter(
            (search) =>
              search.searchTerm.toLowerCase() !== trimmedTerm.toLowerCase()
          );

          const updatedSearches = [newSearch, ...filteredSearches].slice(
            0,
            MAX_RECENT_SEARCHES
          );

          // Save to storage
          saveToStorage(updatedSearches);

          console.log(
            `Added search: "${trimmedTerm}", total: ${updatedSearches.length}`
          );
          return updatedSearches;
        } catch (error) {
          console.error("Error in addRecentSearch:", error);
          return prevSearches;
        }
      });
    },
    [saveToStorage]
  );

  const saveSearch = useCallback(() => {
    if (!searchQuery || !searchQuery.trim()) {
      console.warn("No search query to save");
      return;
    }

    const trimmedQuery = searchQuery.trim();

    try {
      // Add to local storage first
      addRecentSearch(trimmedQuery);
      console.log("Added to local storage successfully");
      console.log(
        "Sending to backend:",
        JSON.stringify({
          searchTerm: trimmedQuery,
          type: "PROFILE",
          appType: "SETTINGS",
        })
      );
      // Then save to backend
      saveRecentSearch({
        variables: {
          input: {
            searchTerm: trimmedQuery,
            type: "PROFILE",
            appType: "SETTINGS",
          },
        },
      })
        .then((response) => {
          console.log("Backend save response:", response); // Log the response
        })
        .catch((error) => {
          console.error("Error saving search to backend:", error);
          // Backend error shouldn't prevent local storage from working
          if (error.graphQLErrors) {
            console.error("GraphQL Errors:", error.graphQLErrors);
          }
          if (error.networkError) {
            console.error("Network Error:", error.networkError);
          }
        });
    } catch (error) {
      console.error("Error in saveSearch:", error);
    }
  }, [searchQuery, addRecentSearch, saveRecentSearch]);

  const handleDelete = useCallback(
    (id: string, searchTerm: string) => {
      if (!id) {
        console.warn("No ID provided for deletion");
        return;
      }

      try {
        // 1. Delete from local storage based on search term
        setLocalRecentSearches((prevSearches) => {
          const updatedSearches = prevSearches.filter(
            (search) =>
              search._id !== id &&
              search.searchTerm.toLowerCase() !== searchTerm.toLowerCase()
          );
          saveToStorage(updatedSearches);
          console.log(`Deleted local search: ${searchTerm}`);
          return updatedSearches;
        });

        // 2. Delete from backend if it's a backend ID
        if (!id.startsWith("local-")) {
          deleteRecentSearch({
            variables: { searchId: id },
          }).catch((error) => {
            console.error("Error deleting search from backend:", error);
          });
        } else {
          // Extra: also try deleting any backend entries with matching term
          const backendData = data?.getRecentSearches?.data;
          const allBackend = [
            ...(backendData?.recentProfileSearches || []),
            ...(backendData?.recentJobSearches || []),
            ...(backendData?.recentSearchTerms || []),
          ];

          const matchingBackend = allBackend.find(
            (s) => s.searchTerm.toLowerCase() === searchTerm.toLowerCase()
          );

          if (matchingBackend?._id) {
            deleteRecentSearch({
              variables: { searchId: matchingBackend._id },
            }).catch((error) => {
              console.error("Error deleting matching backend search:", error);
            });
          }
        }
      } catch (error) {
        console.error("Error in handleDelete:", error);
      }
    },
    [deleteRecentSearch, saveToStorage, data]
  );

  // Enhanced merged searches function
  const mergedSearches = useCallback(() => {
    try {
      const backendData = data?.getRecentSearches?.data;

      const backendProfileSearches = backendData?.recentProfileSearches || [];
      const backendJobSearches = backendData?.recentJobSearches || [];
      const backendGeneralSearches = backendData?.recentSearchTerms || [];

      // Combine all backend searches with local searches
      const allBackendSearches = [
        ...backendProfileSearches,
        ...backendJobSearches,
        ...backendGeneralSearches,
      ];

      const allSearches = [...localRecentSearches, ...allBackendSearches]
        .filter((search) => search && search.searchTerm) // Filter out invalid entries
        .sort(
          (a, b) =>
            (b.timestamp || b.createdAt || 0) -
            (a.timestamp || a.createdAt || 0)
        )
        .filter((search, index, self) => {
          // Don't render until we're on the client side (Next.js hydration fix)
          if (!isClient) {
            return null;
          }

          return (
            index ===
            self.findIndex(
              (s) =>
                s.searchTerm.toLowerCase() === search.searchTerm.toLowerCase()
            )
          );
        })
        .slice(0, MAX_RECENT_SEARCHES);

      return allSearches;
    } catch (error) {
      console.error("Error in mergedSearches:", error);
      return localRecentSearches.slice(0, MAX_RECENT_SEARCHES);
    }
  }, [data, localRecentSearches]);

  // Load stored searches on mount (only on client side)
  useEffect(() => {
    if (isClient) {
      try {
        const storedSearches = getStoredSearches();
        setLocalRecentSearches(storedSearches);
        console.log(`Loaded ${storedSearches.length} searches from storage`);
      } catch (error) {
        console.error("Error loading stored searches:", error);
      }
    }
  }, [isClient, getStoredSearches]);

  // Refetch on focus or empty search
  useEffect(() => {
    if (isFocus || searchQuery === "") {
      refetch();
    }
  }, [searchQuery, isFocus, refetch]);

  useEffect(() => {
    const checkEmptyStates = () => {
      const isEmpty =
        companyEmpty &&
        interviewEmpty &&
        notificationEmpty &&
        paymentEmpty &&
        phoneEmpty &&
        securityEmpty &&
        emailEmpty &&
        teamEmpty &&
        userEmpty;

      setGeneralEmpty(isEmpty);
      setLoadingResults(false);
    };

    checkEmptyStates();
  }, [
    companyEmpty,
    interviewEmpty,
    notificationEmpty,
    paymentEmpty,
    phoneEmpty,
    securityEmpty,
    emailEmpty,
    teamEmpty,
    userEmpty,
  ]);

  // Add new useEffect for click outside handling
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        searchModalRef.current &&
        !searchModalRef.current.contains(event.target as Node) &&
        !searchInputRef.current?.contains(event.target as Node)
      ) {
        setIsFocus(false);
        setSearchQuery("");
      }
    };

    if (isFocus) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFocus, setIsFocus, setSearchQuery]);

  const handleContainerClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!isFocus) {
      setIsFocus(true);
      searchInputRef.current?.focus();
    }
  };

  const handleSearchIconClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsFocus(true);
    searchInputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.select();
      saveSearch();
    }
  };

  const handleClose = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsFocus(false);
      setSearchQuery("");
    },
    [setIsFocus, setSearchQuery]
  );

  const handleSearchClick = useCallback(
    (searchTerm: string) => {
      setSearchQuery(searchTerm);
      setIsFocus(true); // Keep the dropdown open

      // Put focus back on the input (delayed slightly to ensure state updates first)
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
          searchInputRef.current.select();
        }
      }, 10);
    },
    [setSearchQuery, setIsFocus]
  );

  // Don't render until we're on the client side (Next.js hydration fix)
  if (!isClient) {
    return null;
  }

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {isFocus && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 998,
          }}
          onClick={handleClose}
        />
      )}

      <div
        style={{
          position: "relative",
          width: "100%",
          zIndex: 999,
        }}
      >
        <div
          style={{
            position: isFocus ? "fixed" : "relative",
            top: isFocus ? "20px" : "auto",
            left: isFocus ? "50%" : "auto",
            transform: isFocus ? "translateX(-50%)" : "none",
            width: isFocus ? "47.3vw" : "100%",
            backgroundColor: "white",
            borderRadius: "0.94vw",
            boxShadow: isFocus ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)" : "none",
            border: "1px solid #E0E0E9",
            padding: "0.8rem 1rem",
            zIndex: 1000,
          }}
        >
          <div className="flex items-center gap-3">
            <CiSearch className="text-[1.1vw] text-gray-500" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocus(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search any settings here"
              className="w-full focus:outline-none text-[0.9375vw]"
            />
            {searchQuery && isFocus && (
              <IoMdClose
                className="text-[1.1vw] text-gray-500 cursor-pointer hover:text-gray-700"
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchQuery("");
                }}
              />
            )}
          </div>
        </div>

        {isFocus && (
          <div
            ref={searchModalRef}
            style={{
              position: "fixed",
              top: "75px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "47.3vw",
              backgroundColor: "white",
              borderRadius: "1.041vw",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              border: "1px solid #E0E0E9",
              zIndex: 1000,
              maxHeight: "calc(80vh - 100px)",
              overflowY: "auto",
            }}
          >
            <div className="p-4">
              <h3 className="text-[0.93vw] font-semibold mb-4 mt-4 text-gray-800">
                {searchQuery ? "Search Results" : "Recent Searches"}
              </h3>
              <div className="space-y-1">
                {searchQuery ? (
                  <>
                    <EmailSearch
                      searchQuery={searchQuery}
                      setIsFocus={setIsFocus}
                      setSearchQuery={setSearchQuery}
                      setEmpty={setEmailEmpty}
                    />
                    <UserSearch
                      searchQuery={searchQuery}
                      setIsFocus={setIsFocus}
                      setSearchQuery={setSearchQuery}
                      setEmpty={setUserEmpty}
                    />
                    <TeamSearch
                      searchQuery={searchQuery}
                      setIsFocus={setIsFocus}
                      setSearchQuery={setSearchQuery}
                      setEmpty={setTeamEmpty}
                    />
                    <SecuritySearch
                      searchQuery={searchQuery}
                      setIsFocus={setIsFocus}
                      setSearchQuery={setSearchQuery}
                      setEmpty={setSecurityEmpty}
                    />
                    <CompanySearch
                      searchQuery={searchQuery}
                      setIsFocus={setIsFocus}
                      setSearchQuery={setSearchQuery}
                      setEmpty={setCompanyEmpty}
                    />
                    <PaymentSearch
                      searchQuery={searchQuery}
                      setIsFocus={setIsFocus}
                      setSearchQuery={setSearchQuery}
                      setEmpty={setPaymentEmpty}
                    />
                    <PhoneSearch
                      searchQuery={searchQuery}
                      setIsFocus={setIsFocus}
                      setSearchQuery={setSearchQuery}
                      setEmpty={setPhoneEmpty}
                    />
                    <InterviewSearch
                      searchQuery={searchQuery}
                      setIsFocus={setIsFocus}
                      setSearchQuery={setSearchQuery}
                      setEmpty={setInterviewEmpty}
                    />
                    <NotificationSearch
                      searchQuery={searchQuery}
                      setIsFocus={setIsFocus}
                      setSearchQuery={setSearchQuery}
                      setEmpty={setNotiicationEmpty}
                    />
                    {generalEmpty && !loadingResults && (
                      <NotFound searchQuery={searchQuery} />
                    )}
                  </>
                ) : (
                  mergedSearches().map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between p-[0.83vw] hover:bg-[#f4f4fa] cursor-pointer rounded-[0.73vw] group"
                    >
                      <div
                        onClick={() => handleSearchClick(item.searchTerm)}
                        className="flex gap-[0.83vw] items-center flex-1"
                      >
                        <CiSearch className="text-[0.93vw] text-gray-500" />
                        <p className="text-[0.93vw] text-gray-600">
                          {item.searchTerm}
                        </p>
                      </div>
                      <IoMdClose
                        className="text-[0.93vw] text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item._id, item.searchTerm);
                        }}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneralSearchBar;
