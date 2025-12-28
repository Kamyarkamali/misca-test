// helpers/cropImage.ts
export const getCroppedImg = (imageSrc: string, crop: any): Promise<File> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("ctx not found");

      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );

      canvas.toBlob((blob) => {
        if (!blob) return reject("blob creation failed");
        const file = new File([blob], "cropped.png", { type: "image/png" });
        resolve(file);
      }, "image/png");
    };
    image.onerror = (err) => reject(err);
  });
};
