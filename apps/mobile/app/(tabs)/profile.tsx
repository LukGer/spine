import { db } from "@/src/db";
import { books } from "@/src/db/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ActivityIndicator, Button, Text, View } from "react-native";

export default function ProfilePage() {
  const queryClient = useQueryClient();

  const mut = useMutation({
    mutationFn: async () => {
      await db.insert(books).values({
        title: "The Great Gatsby",
        authors: "F. Scott Fitzgerald",
        publisher: "Scribner",
        publishedDate: "1925",
        description: "A novel about the American dream.",
        pageCount: 180,
        isbn: "9780743273565",
        state: "to_read",
        thumbnailUrl:
          "https://i0.wp.com/americanwritersmuseum.org/wp-content/uploads/2018/02/CK-3.jpg?resize=267%2C400&ssl=1",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["books"],
      });
    },
  });

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Profile</Text>

      <Button title="Add Book" onPress={() => mut.mutate()} />
      {mut.isPending && <ActivityIndicator />}
      {mut.isSuccess && <Text>Book added!</Text>}
    </View>
  );
}
