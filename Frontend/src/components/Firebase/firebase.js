import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firebase-firestore';
import * as Handler from '../../constants/axiosHandler';
import * as ROUTES from '../../constants/routes';
 
const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};
 
class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
  }

  googleOAuth (){
    return new app.auth.GoogleAuthProvider();
  }

  facebookOAuth (){
    return new app.auth.FacebookAuthProvider();
  }

  signInWithProvider(provider){
    this.auth.signInWithPopup(provider).then(function(result) {
      var user = result.user;
      Handler.afterLoginWithGoogleHandler(user);
      //window.location.href = ROUTES.HOME;
    }).catch(function(error) {
      alert(error.message);

    });
  }



  // using Firebase auth API endpoints
  async register (screenname, email, password) {
    console.log("got here to register function", email);
    await this.auth.createUserWithEmailAndPassword(email, password);
    return this.auth.currentUser.updateProfile({
      displayName: screenname
    })
  }

  async registerTempLogin (email, password) {
    console.log("got here to register function", email);
    await this.auth.createUserWithEmailAndPassword(email, password);
  }

  login= (email, password) =>{
    this.auth.signInWithEmailAndPassword(email, password)
    .then(function(User){})
    .catch(function(error){
      var errorCode = error.code;
      var errorMessage = error.message;
      if(errorCode === 'auth/wrong-password'){
        alert('Invalid password!');
      }else{
        alert(errorMessage);
      }
    });
  }

  logout =() => {
    this.auth.signOut();
    console.log('Signed Out');
  }

  passwordReset = email =>{
    this.auth.sendPasswordResetEmail(email);
  }
  passwordUpdate = password =>{
    this.auth.currentUser.updatePassword(password);
  }

  sendAccountVerificationEmail (email,screenname) {
    var user = this.auth.currentUser;

    user.sendEmailVerification().then(function() {
      // Email sent.
    }).catch(function(error) {
      // error 
    });

  }

}
 
export default new Firebase();



// import firebase from 'firebase/app';
// import 'firebase/auth';
// //import 'firebase/database';

// const app = firebase.initializeApp({
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN
//   //databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL
// });

// export default app;