import { ReadState, ReadStates } from "@/src/db/schema";
import { Canvas, Circle, Path } from "@shopify/react-native-skia";
import { PropsWithChildren } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import * as Menu from "zeego/dropdown-menu";
import { COLORS } from "../colors";

const toReadIcon = require("../../assets/images/to_read.png");
const readingIcon = require("../../assets/images/reading.png");
const readIcon = require("../..//assets/images/read.png");

const getStateColor = (state: ReadState) => {
  switch (state) {
    case "to_read":
      return COLORS.purple;
    case "reading":
      return COLORS.orange;
    case "read":
      return COLORS.green;
  }
};

const StateIcon = ({ state }: { state: ReadState }) => {
  const color = getStateColor(state);
  return (
    <Canvas style={styles.iconContainer}>
      <Circle
        cx={16}
        cy={16}
        r={12}
        style="stroke"
        strokeWidth={4}
        color={color}
      />
      {state === "reading" && (
        <Path
          path="M9 16C9 20.2 12.134 23 16 23C19.4206 23 22.2682 20.808 22.8789 17.3937C23.015 16.6326 22.3732 16 21.6 16L17.4 16C16.6268 16 16 15.3732 16 14.6L16 10.4C16 9.62681 15.3682 8.98552 14.605 9.10957C11.1914 9.6644 9 12.2843 9 16Z"
          style="fill"
          color={color}
        />
      )}
      {state === "read" && (
        <Circle
          cx={16}
          cy={16}
          r={7}
          style="fill"
          strokeWidth={4}
          color={color}
        />
      )}
    </Canvas>
  );
};

const getStateLabel = (state: ReadState) => {
  switch (state) {
    case "to_read":
      return "To Read";
    case "reading":
      return "Reading";
    case "read":
      return "Read";
  }
};

const getStateImage = (state: ReadState) => {
  switch (state) {
    case "to_read":
      return toReadIcon;
    case "reading":
      return readingIcon;
    case "read":
      return readIcon;
  }
};

type BookStateMenuProps = PropsWithChildren<{
  onStateChange: (state: ReadState) => void;
}>;

const BookStateMenu = ({ children, onStateChange }: BookStateMenuProps) => {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>{children}</Menu.Trigger>
      <Menu.Content>
        {ReadStates.map((state) => (
          <Menu.Item key={state} onSelect={() => onStateChange(state)}>
            <Menu.ItemImage source={getStateImage(state)} />
            <Menu.ItemTitle>{getStateLabel(state)}</Menu.ItemTitle>
          </Menu.Item>
        ))}
      </Menu.Content>
    </Menu.Root>
  );
};

type BookStateButtonProps = {
  state: ReadState;
  onStateChange: (state: ReadState) => void;
};

export default function BookStateButton({
  state,
  onStateChange,
}: BookStateButtonProps) {
  return (
    <BookStateMenu onStateChange={onStateChange}>
      <TouchableOpacity style={styles.container}>
        <StateIcon state={state} />
      </TouchableOpacity>
    </BookStateMenu>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
});
