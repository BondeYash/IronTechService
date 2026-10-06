import Image from "next/image";
import imageMetadata from "@/data/image-metadata.json";
import { cn } from "@/lib/utils";

export function imageSize(src: string) {
  const size = (imageMetadata as Record<string, { width: number; height: number }>)[src];
  if (!size) throw new Error(`Missing image dimensions for ${src}. Run npm run images:audit.`);
  return size;
}

/** A complete, proportional image. Captions belong outside this component. */
export function ProjectPhoto({
  src,
  alt,
  sizes,
  className,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
}) {
  const { width, height } = imageSize(src);
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      quality={85}
      className={cn("mx-auto block h-auto w-full max-w-full", className)}
      style={{ maxWidth: width }}
    />
  );
}
