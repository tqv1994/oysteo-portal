export type Media = {
	id: number;
	alternativeText: string;
	caption: string;
	blurHash: string;
	width: number;
	height: number;
	hash: string;
	size: number;
	url: string;
	previewUrl: string;
};

export const uploadFileFieldsFragment = `
fragment uploadFileFields on UploadFile {
    id
    name
    alternativeText
    caption
    blurHash
    width
    height
    formats
    hash
    size
    url
    previewUrl
}
`;
