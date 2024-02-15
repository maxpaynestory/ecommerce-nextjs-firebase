"use client";
import "./ColorChooser.css";

interface ColorChooserProps {
  availableColors: string[];
}

const ColorChooser = (props: ColorChooserProps) => {
  return (
    <div className="color-chooser">
      {props.availableColors.map((color) => (
        <div
          className="color-item color-item-selected"
          key={color}
          style={{ backgroundColor: color }}
          role="presentation"
        />
      ))}
    </div>
  );
};

export default ColorChooser;
