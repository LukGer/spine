import { books, DbBook } from "@/src/db/schema";
import * as AppleColors from "@bacons/apple-colors";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eq } from "drizzle-orm";
import { Image } from "expo-image";
import { SymbolView } from "expo-symbols";
import { useEffect, useState } from "react";
import {
  Image as RNImage,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";
import { db } from "../db";

const IMAGE_HEIGHT = 400;

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

  function RightAction(
    progress: SharedValue<number>,
    drag: SharedValue<number>
  ) {
    const scale = useDerivedValue(
      () => withSpring(drag.value < -75 ? 1.5 : 1),
      [drag]
    );

    const containerStyle = useAnimatedStyle(() => ({
      width: Math.max(100, -drag.value),
    }));

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    return (
      <Animated.View style={[styles.rightAction, containerStyle]}>
        <View style={styles.actionButton}>
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
        </View>
      </Animated.View>
    );
  }

  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    if (!book.thumbnailUrl) return;
    RNImage.getSize(book.thumbnailUrl, (w, h) => {
      setWidth((IMAGE_HEIGHT * w) / h); // Calculate width based on fixed height
    });
  }, [book.thumbnailUrl]);

  return (
    <View key={book.isbn} style={styles.container}>
      <Swipeable
        containerStyle={styles.imageContainer}
        renderRightActions={RightAction}
      >
        <Image
          source={book.thumbnailUrl}
          style={[styles.image, { width, height: IMAGE_HEIGHT }]}
        />
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
