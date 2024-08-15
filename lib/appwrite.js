import { 
     Client,
     Account, 
     ID, 
     Avatars, 
     Databases, 
     Query,
     Storage
    } from 'react-native-appwrite';


export const appWriteConfig = {
    endpoint:'https://cloud.appwrite.io/v1',
    platform :'com.dys.aora',
    projectId: '66b9b1e6003abcaa95de',
    databaseId :'66b9b3800012339a6149',
    userCollectionId:'66b9b3c20033574a204c',
    videoCollectionId: '66b9b3f6002983a3b170',
    storageId :'66b9b623000af8d8b01d',
};

const{
    storageId,
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
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
const storage =  new Storage(client);


// Register user
export async function createUser (email, password, username) {
   try {
    const newAccount  = await account.create(
        ID.unique(),
        email,
        password,
        username
    );

    if(!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
        appWriteConfig.databaseId,
        appWriteConfig.userCollectionId,
        ID.unique(),
        {
            accountId  : newAccount.$id,
            email : email ,
            username : username,
            avatar : avatarUrl
        }
    );
    return newUser;

   }
   catch (error){
    console.log(error);
    throw new Error(error);
   }
}

export const signIn =  async (email, password) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } 
    catch (error) {
        throw new Error(error);
    }
}

export const getCurrentUser = async () =>{
    try{
        const currentAccount = await account.get();

        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appWriteConfig.databaseId,
            appWriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );

        if(!currentUser) throw Error;
        return currentUser.documents[0];
        
    }
    catch (error){
       console.log(error); 
    }
}

export const getAllPosts = async () =>{
    try{
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt')]
        )

        return posts.documents;
    }
    catch (error){
        throw new Error(error);
    }
}

export const getLatestPosts = async () =>{
    try{
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt', Query.limit(7))]
        )

        return posts.documents;
    }
    catch (error){
        throw new Error(error);
    }
}

export const searchPost = async (query) =>{
    try{
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.search('title', query)]
        )

        return posts.documents;
    }
    catch (error){
        throw new Error(error);
    }
}

export const getUserPosts = async (userId) =>{
    try{
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.equal('creator', userId )]
        );

        return posts.documents;
    }
    catch (error){
        throw new Error(error);
    }
}

export const signOut = async() =>{
    try {
        const session =await account.deleteSession('current');

        return session;
    } catch (error) {
        throw new Error(error);
    }
}

export const getFilePreview = async (fileId, type) =>{
    let fileUrl;

    try {
        if(type === 'video'){
            fileUrl = storage.getFileView(storageId, fileId)
        }
        else if(type === 'image'){
            fileUrl = storage.getFilePreview(storageId, fileId, 2000, 2000, 'top', 100)
        }
        else{
            throw new Error ('Invalid file type')
        }

        if(fileUrl === "") throw Error;

        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
}

export const uploadFile = async (file, type) =>{
    if(file=== "") return;

    const asset = {
        name :file.fileName,
        type:file.mimeType,
        size:file.fileSize,
        uri:file.uri,
    }
    try {
        const uploadFile = await storage.createFile(
            storageId,
            ID.unique,
            asset
        );

        const fileUrl  = await getFilePreview(uploadFile.$id, type);
        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
}

export const createVideo = async (form) =>{

    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail ,'image'),
            uploadFile(form.video ,'video'),
        ])

        const newPost = await databases.createDocument(
            databaseId,
            videoCollectionId,
            ID.unique(),
            {
                title : form.title,
                thumbnail : thumbnailUrl,
                video : videoUrl,
                prompt : form.prompt,
                creator : form.userId
            }
        )

        return newPost;
    } catch (error) {
        throw new Error(error);
    }
}