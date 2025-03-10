import { books, DbBook, ReadState } from "@/src/db/schema";
import * as AppleColors from "@bacons/apple-colors";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eq } from "drizzle-orm";
import { Button, StyleSheet, Text, View } from "react-native";
import { db } from "../db";
import BookStateButton from "./BookStateButton";
import Scene from "./Scene";

const IMAGE_HEIGHT = 400;

const BooksListItem = ({ book }: { book: DbBook }) => {
  const queryClient = useQueryClient();

  const changeBookStateMutation = useMutation({
    mutationFn: (state: ReadState) => {
      return db
        .update(books)
        .set({ state })
        .where(eq(books.id, book.id))
        .execute();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["books"], exact: true });
    },
  });

  const removeBookMutation = useMutation({
    mutationFn: async (id: number) => {
      await db.delete(books).where(eq(books.id, id)).execute();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["books"], exact: true });
    },
  });

  return (
    <View key={book.isbn} className="flex flex-col gap-1">
      <Scene coverUrl={book.thumbnailUrl ?? ""} />

      <View className="flex flex-row items-center gap-4">
        <BookStateButton
          state={book.state}
          onStateChange={(state) => {
            changeBookStateMutation.mutate(state);
          }}
        />

        <Text style={styles.title}>{book.title}</Text>
      </View>

      <Text style={styles.authors}>{book.authors}</Text>

      <Text style={styles.publisher}>{book.publisher}</Text>

      <Text style={styles.pageCount}>{book.pageCount} p.</Text>

      <Button
        title="Remove"
        onPress={() => {
          removeBookMutation.mutate(book.id);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 2,
  },
  imageContainer: {
    height: IMAGE_HEIGHT,
    alignSelf: "center",
  },
  image: {
    alignSelf: "center",
  },
  title: {
    marginVertical: 8,
    color: AppleColors.darkText,
    fontSize: 20,
    fontWeight: "bold",
  },
  authors: {
    color: AppleColors.label,
    fontWeight: "300",
    fontSize: 16,
  },
  publisher: {
    color: AppleColors.label,
    fontSize: 16,
    fontWeight: "300",
    fontStyle: "italic",
  },
  pageCount: {
    color: AppleColors.label,
    fontWeight: "300",
    fontSize: 16,
  },
  rightAction: {
    height: "100%",
    backgroundColor: AppleColors.systemRed,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  actionButton: {
    position: "absolute",
    width: 100,
    height: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BooksListItem;
