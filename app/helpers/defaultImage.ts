// گذاشتن عکس دیفالت برای کسب و کار
const getDefaultLogoFile = async (): Promise<File> => {
  const res = await fetch("/images/default.webp");
  const blob = await res.blob();

  return new File([blob], "default.webp", {
    type: "image/webp",
  });
};

export { getDefaultLogoFile };
