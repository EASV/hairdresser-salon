export function dataURItoBlob(uid: string, base64: string): File {
  // convert base64/URLEncoded data component to a data
  let byteString;
  if (base64.split(',')[0].indexOf('base64') >= 0) {
    byteString = atob(base64.split(',')[1]);
  } else {
    byteString = unescape(base64.split(',')[1]);
  }
  // separate out the mime component
  const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
  // write the bytes of the string to a typed array
  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const file = new File([ia], uid, {type: mimeString});
  return file;
}
