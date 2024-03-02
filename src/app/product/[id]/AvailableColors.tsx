"use client";

import { useRef } from "react";
import ColorChooser from "../../components/common/colorChooser";

type AvailableColorsProps = {
  availableColors: string[];
};

export default function AvailableColors(props: AvailableColorsProps) {
  const colorOverlay = useRef(null);
  const onSelectedColor = (color: string) => {
    console.log(`This is the color ${color}`);
  };
  return (
    <>
      <ColorChooser
        availableColors={props.availableColors}
        onSelectedColorChange={onSelectedColor}
      />
    </>
  );
}
