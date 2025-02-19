import { db } from "@/src/db";
import {
  authors,
  books,
  booksToAuthors,
  booksToCategories,
  categories,
} from "@/src/db/schema";
import { useMutation } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { ActivityIndicator, Button, View } from "react-native";

export default function AddPage() {
  const mutation = useMutation({
    mutationFn: async () => {
      const [author] = await db
        .insert(authors)
        .values([{ name: "J.K. Rowling" }])
        .returning()
        .execute();

      const [category] = await db
        .insert(categories)
        .values([{ name: "Juvenile Fiction" }])
        .returning()
        .execute();

      const [book] = await db
        .insert(books)
        .values([
          {
            title: "Harry Potter und der Stein der Weisen",
            publisher: "Pottermore Publishing",
            publishedDate: "2015-12-08",
            description:
              "Eigentlich hatte Harry geglaubt, er sei ein ganz normaler Junge. Zumindest bis zu seinem elften Geburtstag. Da erfährt er, dass er sich an der Schule für Hexerei und Zauberei einfinden soll. Und warum? Weil Harry ein Zauberer ist. Und so wird für Harry das erste Jahr in der Schule das spannendste, aufregendste und lustigste in seinem Leben. Er stürzt von einem Abenteuer in die nächste ungeheuerliche Geschichte, muss gegen Bestien, Mitschüler und Fabelwesen kämpfen. Da ist es gut, dass er schon Freunde gefunden hat, die ihm im Kampf gegen die dunklen Mächte zur Seite stehen.",
            isbn: "9781781100769",
            pageCount: 359,
            averageRating: 4,
            thumbnailUrl:
              "http://books.google.com/books/content?id=XtekEncdTZcC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
            state: "read",
          },
        ])
        .returning()
        .execute();

      await db
        .insert(booksToAuthors)
        .values([{ bookId: book.id, authorId: author.id }])
        .execute();

      await db
        .insert(booksToCategories)
        .values([{ bookId: book.id, categoryId: category.id }])
        .execute();
    },
  });

  return (
    <>
      <Stack.Screen options={{ headerTitle: "Add new book" }} />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Button
          disabled={mutation.isPending}
          title="Add authors"
          onPress={() => mutation.mutate()}
        />

        {mutation.isPending && <ActivityIndicator />}
      </View>
    </>
  );
}
