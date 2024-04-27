export const imageToFile = async (webpath: string) => {
  const blob = await fetch(webpath).then((r) => r.blob());

  const formData = new FormData();
  formData.append('image', blob);

  return formData.get('image') as File;
};
