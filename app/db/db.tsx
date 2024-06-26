import * as SQLite from 'expo-sqlite';



export const connectToDatabase = async () => {
    return ( 
        SQLite.openDatabaseAsync("InTouchDB")
        .then(onfufilled => {

        }, onrejected => {
            console.log("failed to open db")
        })
    )
  }
