import { books } from "@/src/db/schema";
import * as AppleColors from "@bacons/apple-colors";
import { BookResponse } from "@repo/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eq } from "drizzle-orm";
import { Image } from "expo-image";
import { SymbolView } from "expo-symbols";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image as RNImage,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../db";
import { useBookByIsbnQuery } from "../repository/books";

const IMAGE_HEIGHT = 400;

const AddBooksListItem = ({ book }: { book: BookResponse }) => {
  const bookQuery = useBookByIsbnQuery(book.isbn);

  const queryClient = useQueryClient();

  const bookMutation = useMutation({
    mutationFn: async ({
      book,
      operation,
    }: {
      book: BookResponse;
      operation: "add" | "remove";
    }) => {
      if (operation === "add") {
        await db
          .insert(books)
          .values({
            isbn: book.isbn,
            title: book.title,
            authors: book.authors.join(", "),
            publisher: book.publisher,
            publishedDate: book.publishedDate,
            description: book.description,
            pageCount: book.pageCount,
            thumbnailUrl: book.coverImageUrl,
            state: "to_read",
          })
          .execute();
      } else {
        await db.delete(books).where(eq(books.isbn, book.isbn)).execute();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books", book.isbn] });
      queryClient.invalidateQueries({ queryKey: ["books"], exact: true });
    },
  });

  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    if (!book.coverImageUrl) return;
    RNImage.getSize(book.coverImageUrl, (w, h) => {
      setWidth((IMAGE_HEIGHT * w) / h);
    });
  }, [book.coverImageUrl]);

  const isAdded = bookQuery.isFetched && bookQuery.data;

  return (
    <View key={book.isbn} style={styles.container}>
      <Image
        source={book.coverImageUrl}
        style={[styles.image, { width, height: IMAGE_HEIGHT }]}
      />
      <Text style={styles.title}>{book.title}</Text>

      <Text style={styles.authors}>{book.authors.join(", ")}</Text>

      <Text style={styles.publisher}>{book.publisher}</Text>

      <Text style={styles.pageCount}>{book.pageCount} p.</Text>

      <TouchableOpacity
        onPress={() =>
          bookMutation.mutate({ book, operation: !isAdded ? "add" : "remove" })
        }
        disabled={bookMutation.isPending}
        style={!isAdded ? styles.addButton : styles.removeButton}
      >
        {bookMutation.isPending ? (
          <ActivityIndicator color="white" />
        ) : (
          <SymbolView
            name={!isAdded ? "plus" : "xmark"}
            size={20}
            tintColor="white"
          />
        )}
        <Text style={styles.buttonText}>
          {!isAdded ? "Add to list" : "Remove from list"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 2,
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
  addButton: {
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: AppleColors.systemOrange,
  },
  removeButton: {
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: AppleColors.systemRed,
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
  },
});

export default AddBooksListItem;
