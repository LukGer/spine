import * as AppleColors from "@bacons/apple-colors";
import { BookResponse } from "@repo/api";
import { useMutation } from "@tanstack/react-query";
import { inArray } from "drizzle-orm";
import { Image } from "expo-image";
import { SymbolView } from "expo-symbols";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../db";
import { authors, books, booksToAuthors } from "../db/schema";

const AddBooksListItem = ({ book }: { book: BookResponse }) => {
  const addBookMutation = useMutation({
    mutationFn: async (book: BookResponse) => {
      const bookAuthors = book.authors;

      const existingAuthors = await db
        .select()
        .from(authors)
        .where(inArray(authors.name, bookAuthors));

      const existingAuthorNames = new Set(existingAuthors.map((a) => a.name));

      // Filter out authors that already exist
      const newAuthors = bookAuthors.filter(
        (author) => !existingAuthorNames.has(author)
      );

      if (newAuthors.length > 0) {
        // Insert new authors
        await db
          .insert(authors)
          .values(newAuthors.map((name) => ({ name })))
          .execute();
      }

      const allAuthors = await db
        .select()
        .from(authors)
        .where(inArray(authors.name, bookAuthors));

      const newBook = await db
        .insert(books)
        .values({
          isbn: book.isbn,
          title: book.title,
          subtitle: book.subtitle,
          publisher: book.publisher,
          publishedDate: book.publishedDate,
          description: book.description,
          pageCount: book.pageCount,
          thumbnailUrl: book.thumbnailUrl,
          state: "to_read",
        })
        .returning({ id: authors.id })
        .execute();

      await db
        .insert(booksToAuthors)
        .values(
          allAuthors.map((author) => ({
            bookId: newBook[0].id,
            authorId: author.id,
          }))
        )
        .execute();
    },
  });

  return (
    <View key={book.isbn} style={styles.container}>
      <Image source={book.thumbnailUrl} style={styles.image} />
      <Text style={styles.title}>{book.title}</Text>

      <Text style={styles.authors}>{book.authors.join(", ")}</Text>

      <Text style={styles.publisher}>{book.publisher}</Text>

      <Text style={styles.pageCount}>{book.pageCount} p.</Text>

      <TouchableOpacity
        onPress={() => addBookMutation.mutate(book)}
        disabled={addBookMutation.isPending}
        style={styles.addToListButton}
      >
        {addBookMutation.isPending ? (
          <ActivityIndicator color="white" />
        ) : (
          <SymbolView name="plus" size={20} tintColor="white" />
        )}
        <Text style={styles.addToListButtonText}>Add to list</Text>
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
    width: "75%",
    aspectRatio: 2 / 3,
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
  addToListButton: {
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: AppleColors.systemOrange,
  },
  addToListButtonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
  },
});

export default AddBooksListItem;
