import { Account, Client, Databases, Storage, ID } from 'appwrite'

export const useAppwriteConfig = () => {
    const config = useRuntimeConfig().public;

    const client = new Client();
    client
        .setEndpoint('https://cloud.appwrite.io/v1')
        .setProject(config.projectId);

    const account = new Account(client);
  
    const db = new Databases(client);
    const storage = new Storage(client);

    const dbId = config.dbId;

    return {
        client,
        account,
        ID,
        storage,
        db,
        dbId
    }
}
