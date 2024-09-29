const Base_url = 'https://flash-card-backend-bice.vercel.app/api';

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
  imageFolder: `${Base_url}/images/folder`,
  profilePic: `${Base_url}/profile/picture`,
};

export default Api;
