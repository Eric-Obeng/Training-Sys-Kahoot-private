export const  truncateFileName =(fileName: string, maxLength: number = 50): string =>{
  if (!fileName) return '';
  if (fileName.length <= maxLength) {
    return fileName;
  }
  const extensionStart = fileName.lastIndexOf('.');
  if (extensionStart === -1) {
    return fileName.substring(0, maxLength) + '...';
  }
  const namePart = fileName.substring(0, extensionStart);
  const extension = fileName.substring(extensionStart);
  if (namePart.length > maxLength - extension.length) {
    return namePart.substring(0, maxLength - extension.length - 3) + '...' + extension;
  }
  return fileName;
}
