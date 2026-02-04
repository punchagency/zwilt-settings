import { useState } from 'react';

interface SearchResult {
  id: number;
  name: string;
}

const useSearch = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const performSearch = async (query: string) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate an API call with a delay
      const response = await new Promise<{ data: SearchResult[] }>((resolve) => {
        setTimeout(() => {
          const mockResults: SearchResult[] = [
            { id: 1, name: 'Result 1' },
            { id: 2, name: 'Result 2' },
            { id: 3, name: 'Result 3' },
          ];
          resolve({ data: mockResults });
        }, 1000);
      });

      setSearchResults(response.data);
    } catch (err) {
      setError('An error occurred while fetching search results.');
    } finally {
      setLoading(false);
    }
  };

  return { searchResults, loading, error, performSearch };
};

export default useSearch;
