const Base_url = 'https://flash-card-backend-bice.vercel.app/api';

const Api = {
  signUp: `${Base_url}/signUp`,
  verifyOtp: `${Base_url}/signUp/verifyOtp`,
  signIn:  `${Base_url}/login`,
  getCardType: `${Base_url}/card/type`,
  Folder: `${Base_url}/folder`,
  Set: `${Base_url}/set`,
};

export default Api;
