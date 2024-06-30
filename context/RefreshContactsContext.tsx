import { createContext } from "react";

// export type refrehContactsInterface = {
//   isRefreshingContacts: boolean,
//   setIsRefreshingContacts:  React.Dispatch<React.SetStateAction<boolean>>,
// }
export const RefreshContactsContext = createContext({
  isRefreshingContacts: false, 
  refreshContacts: () => {},
}
)