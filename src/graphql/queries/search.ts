import { gql } from "@apollo/client";


// export const RecentSearches = gql`
//     query Query {
//         getRecentSearches
//     }
// `

export const RecentSearches = gql`
query GetRecentSearches($appType: String) {
  getRecentSearches(appType: $appType)
}
`;


export const DeleteRecentSearch = gql`
 mutation DeleteRecentSearch($searchId: String) {
  deleteRecentSearch(searchId: $searchId)
}
`