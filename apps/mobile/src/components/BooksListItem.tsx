import { books, DbBook } from "@/src/db/schema";
import * as AppleColors from "@bacons/apple-colors";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eq } from "drizzle-orm";
import { Image } from "expo-image";
import { SymbolView } from "expo-symbols";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { db } from "../db";

const BooksListItem = ({ book }: { book: DbBook }) => {
  const queryClient = useQueryClient();

  const removeBookMutation = useMutation({
    mutationFn: async (id: number) => {
      await db.delete(books).where(eq(books.id, id)).execute();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["books"], exact: true });
    },
  });

  function RightAction(_: SharedValue<number>, drag: SharedValue<number>) {
    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            scale: interpolate(drag.value, [-75, -100], [1, 1.5], {
              extrapolateRight: Extrapolation.CLAMP,
              extrapolateLeft: Extrapolation.CLAMP,
            }),
          },
        ],
      };
    });

    return (
      <Animated.View style={styles.rightAction}>
        <TouchableOpacity
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => removeBookMutation.mutate(book.id)}
        >
          <Animated.View style={animatedStyle}>
            <SymbolView name="xmark.app" size={28} tintColor="white" />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <View key={book.isbn} style={styles.container}>
      <Swipeable
        containerStyle={styles.imageContainer}
        renderRightActions={RightAction}
      >
        <Image source={book.thumbnailUrl} style={styles.image} />
      </Swipeable>
      <Text style={styles.title}>{book.title}</Text>

      <Text style={styles.authors}>{book.authors}</Text>

      <Text style={styles.publisher}>{book.publisher}</Text>

      <Text style={styles.pageCount}>{book.pageCount} p.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 2,
  },
  imageContainer: {
    width: "75%",
    alignSelf: "center",
  },
  image: {
    width: "100%",
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
  rightAction: {
    width: 100,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: AppleColors.systemRed,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
});

export default BooksListItem;
