/** Fit without cropping, distortion, or enlarging beyond the available pixels. */
export function fitImage(width: number, height: number, boundsWidth: number, boundsHeight: number) {
  if (
    [width, height, boundsWidth, boundsHeight].some(
      (value) => !Number.isFinite(value) || value <= 0,
    )
  ) {
    return { width: 0, height: 0, scale: 0 };
  }
  const scale = Math.min(1, boundsWidth / width, boundsHeight / height);
  return { width: width * scale, height: height * scale, scale };
}
