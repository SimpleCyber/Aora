import { 
  Client,
  Account, 
  ID, 
  Avatars, 
  Databases, 
  Query,
  Storage,
  Models
} from 'react-native-appwrite';

interface FileAsset {
  name: string;
  type: string;
  size: number;
  uri: string;
}


export const appWriteConfig = {
  endpoint: 'https://cloud.appwrite.io/v1',
  platform: 'com.dys.aora',
  projectId: '66b9b1e6003abcaa95de',
  databaseId: '66b9b3800012339a6149',
  userCollectionId: '66b9b3c20033574a204c',
  videoCollectionId: '66b9b3f6002983a3b170',
  storageId: '66b9b623000af8b01d',
};

const {
  storageId,
  databaseId,
  videoCollectionId,
} = appWriteConfig;

const client = new Client();

client
  .setEndpoint(appWriteConfig.endpoint) 
  .setProject(appWriteConfig.projectId)
  .setPlatform(appWriteConfig.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Register user
export async function createUser(email: string, password: string, username: string): Promise<Models.Document> {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw new Error('Account creation failed');

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appWriteConfig.databaseId,
      appWriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl
      }
    );
    return newUser;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export const signIn = async (email: string, password: string): Promise<Models.Session> => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export const getCurrentUser = async (): Promise<Models.Document | null> => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw new Error('No current account');

    const currentUser = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    );

    if (!currentUser) throw new Error('User not found');
    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const getAllPosts = async (): Promise<Models.Document[]> => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.orderDesc('$createdAt')]
    );
    return posts.documents;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export const getLatestPosts = async (): Promise<Models.Document[]> => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.orderDesc('$createdAt'), Query.limit(7)]
    );
    return posts.documents;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export const searchPost = async (query: string): Promise<Models.Document[]> => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.search('title', query)]
    );
    return posts.documents;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export const getUserPosts = async (userId: string): Promise<Models.Document[]> => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.equal('creator', userId)]
    );
    return posts.documents;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export const signOut = async (): Promise<void> => {
  try {
    await account.deleteSession('current');
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export const getFilePreview = async (fileId: string, type: 'video' | 'image'): Promise<string> => {
  try {
    const fileUrl =
      type === 'video'
        ? storage.getFileView(storageId, fileId)
        : storage.getFilePreview(storageId, fileId, 2000, 2000);

    return fileUrl.href;
  } catch (error: any) {
    throw new Error(error.message);
  }
};





export const uploadFile = async (file: FileAsset, type: 'video' | 'image'): Promise<string> => {
  if (!file) throw new Error('No file provided');

  const asset = {
    name: file.name,
    type: file.type,
    size: file.size,
    uri: file.uri,
  };

  try {
    const uploadedFile = await storage.createFile(
      storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

type VideoForm = {
  title: string;
  thumbnail: FileAsset;
  video: FileAsset;
  prompt: string;
  userId: string;
};

export const createVideo = async (form: VideoForm): Promise<Models.Document> => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, 'image'),
      uploadFile(form.video, 'video'),
    ]);

    const newPost = await databases.createDocument(
      databaseId,
      videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId
      }
    );

    return newPost;
  } catch (error: any) {
    throw new Error(error.message);
  }
}