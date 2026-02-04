import { gql } from "@apollo/client";

// export const SAVE_SETTINGS = gql `
//     mutation saveSettingsRecentSearch($input: RecentSearchInput) {
//   saveSettingsRecentSearch(input: $input)
// }
// `

export const SAVE_SETTINGS = gql `
    mutation saveRecentSearch($input: RecentSearchInput!) {
  saveRecentSearch(input: $input)
}
`