import Image from "next/image";

export default function ScImage(props: any) {
  const { src, alt, width, height } = props;
  const styles: any = {
    width: width,
    height: height,
    position: "relative",
  };
  return (
    <div style={styles}>
      <Image
        src={src}
        alt={alt}
        className="position-relative"
        fill
        style={{ objectPosition: "top center", objectFit: "cover" }}
      />
    </div>
  );
}
