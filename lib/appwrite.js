import { Account, Avatars, Client, Databases, ID } from 'react-native-appwrite';

export const config = {
  endpoint: 'https://cloud.appwrite.io/v1',
  plateform: 'com.ldh.aora',
  projectId: '66a68498000e5b26310f',
  databaseId: '66a685ca003ca6510f4d',
  userCollectionId: '66a685f300208b7ac790',
  videoCollectionId: '66a6862100010dfa304f',
  storageId: '66a687c7000636257bee'
}

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.plateform)
  ;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    )

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique({
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl
      })
    )

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

export async function signIn(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    throw new Error(error);
  }
}
