import { useEffect } from 'react';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { GetEmailAccounts } from '@/graphql/queries/emailAccount';
import { UnAssignEmailAccount, AssignEmailAccount} from '@/graphql/mutations/emailAccount';


const useGetEmailAccount = () => {
    const { data, loading, error, refetch } = useQuery(GetEmailAccounts); //pass your get email account query
    return {
        emailAcccountData: data,
       emailAccountLoading: loading,
        emailAccountError: error,
        emailAccountRefetch: refetch,
    };
};

const useEmailAccountService = () => {
    
   // const { updateSearch } = useSearch();

    const {
        emailAccountRefetch,
        emailAcccountData,
        emailAccountLoading,
        emailAccountError,
    } = useGetEmailAccount();



    
    const [assignEmailAccount] = useMutation(AssignEmailAccount, {
        onCompleted: (data) => {
            console.log(`email asiigned succesfull ${data}` );
        },
    });


    const [deleteRecentSearch] = useMutation(UnAssignEmailAccount, {
        onCompleted: (data) => {
            console.log('Recent search deleted successfully...');
        },
    });

    // useEffect(() => {
    //     if (emailAcccountData) {
    //         updateSearch({
    //             recentSearches:
    //                 recentSearchesData.getRecentSearches.data || null,
    //         });
    //     }
    // }, [emailAcccountData]);


    return {
        emailAccountRefetch,
        emailAcccountData,
        emailAccountLoading,
        emailAccountError,
    };
};
export default useEmailAccountService;