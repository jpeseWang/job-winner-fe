export const getDownloadUrl = (url: string): string => {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}fl_attachment`;
};

export const downloadFile = (url: string, filename = "file"): void => {
    const link = document.createElement("a");
    link.href = getDownloadUrl(url);
    link.download = filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
