import type { ImgHTMLAttributes } from 'react';

type ProtectedPhotoProps = ImgHTMLAttributes<HTMLImageElement>;

export function ProtectedPhoto({ alt, ...props }: ProtectedPhotoProps) {
  return (
    <img
      {...props}
      alt={alt}
      data-protected-photo
      draggable={false}
      onContextMenu={(event) => event.preventDefault()}
    />
  );
}
