const Base_url = 'https://biblestudycards.app/api';

const Api = {
  signUp: `${Base_url}/signUp`,
  verifyOtp: `${Base_url}/signUp/verifyOtp`,
  signIn: `${Base_url}/login`,
  getCardType: `${Base_url}/card/type`,
  Folder: `${Base_url}/folder`,
  Set: `${Base_url}/set`,
  FolderSet: `${Base_url}/folder/set`,
  card: `${Base_url}/card`,
  blurAllCard: `${Base_url}/blur/all/card`,
  moveCard: `${Base_url}/move/card`,
  assignedFolder: `${Base_url}/assign/folder`,
  notes: `${Base_url}/notes`,
  contacts: `${Base_url}/contacts`,
  searchUser: `${Base_url}/contacts/users`,
  pdfFolder: `${Base_url}/pdf/folder`,
  pdf: `${Base_url}/pdf`,
  FolderPdf: `${Base_url}/folder/pdf`,
  assignPdfFolder: `${Base_url}/assign/pdf/folder`,
  imageFolder: `${Base_url}/images/folder`,
  assignImageFolder: `${Base_url}/assign/image/folder`,
  folderImage: `${Base_url}/folder/images`,
  Images: `${Base_url}/images`,
  profilePic: `${Base_url}/profile/picture`,
};

export default Api;
