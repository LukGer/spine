import * as FileSystem from "expo-file-system";

export const rubberBand = (value: number, limit: number): number => {
  "worklet";
  const sign = Math.sign(value);
  const abs = Math.abs(value);

  if (abs <= limit) {
    return value;
  }

  return sign * limit * (1 + Math.log10((abs - limit) / limit + 1) * 0.75);
};

export const downloadAndSaveImage = async (
  imageUrl: string,
  bookId: string
) => {
  try {
    const fileUri = `${FileSystem.documentDirectory}book_covers/${bookId}.jpg`;

    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (fileInfo.exists) {
      return fileUri;
    }

    const dirUri = `${FileSystem.documentDirectory}book_covers/`;
    const dirInfo = await FileSystem.getInfoAsync(dirUri);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dirUri, { intermediates: true });
    }

    // Download the image
    const downloadResumable = FileSystem.createDownloadResumable(
      imageUrl,
      fileUri
    );

    const downloadResult = await downloadResumable.downloadAsync();

    if (!downloadResult) {
      console.error("Failed to download image");
      return null;
    }

    return downloadResult.uri;
  } catch (error) {
    console.error("Error downloading image:", error);
    return null;
  }
};

export const deleteImage = async (bookId: string) => {
  try {
    const fileUri = `${FileSystem.documentDirectory}book_covers/${bookId}.jpg`;

    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(fileUri);
    }
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};
