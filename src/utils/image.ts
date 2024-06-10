export const imageToFile = async (webpath: string) => {
  const blob = await fetch(webpath, { mode: 'no-cors' }).then((r) => r.blob());
  const blobObject = new Blob([blob], { type: 'application/json' });

  return blobObject;
};
