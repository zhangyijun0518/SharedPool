import Firebase from '../Firebase';
import * as ROUTES from '../../constants/routes';

export default function SignOut() {
  logOutAccount();
  clearLocalStorageItems();
  window.location.href=ROUTES.HOME;
  return null;
};

const clearLocalStorageItems = () => {
  // window.localStorage.removeItem('screenname');
  // window.localStorage.removeItem('nickname');
  // window.localStorage.removeItem('emailForSignIn');
  // window.localStorage.removeItem('passwordForSignIn');
  localStorage.clear()

  console.log("User Input successfully cleared!");
}

function logOutAccount() {
  Firebase.logout();
}