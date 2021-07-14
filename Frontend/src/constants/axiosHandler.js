import Axios from 'axios';
import * as ROUTES from './routes';

export const getUserByEmail = (email)=>{
  console.log("email passed in: ", `${email}`);
  try{
    return Axios.get(`${process.env.REACT_APP_API_SERVER}/user/email?email=${email}`, {} );
  } catch (error){
    console.log(error);
    return error;
  } 
};

export const AddEmailVerifiedUserToDB =(sName, nName, email) =>{
  console.log("axio params:", sName, nName, email);
  Axios.post(`${process.env.REACT_APP_API_SERVER}/user?screenname=${sName}&nickname=${nName}&email=${email}`, {}
  )
    .then(function (response) {
      console.log("axios post response:", response);
      //console.log("current authuser after signed in:", authUser.email, authUser.emailVerified);
      localStorage.setItem("uid", response.data.id)
    }).catch(function (error) {
      console.log(error);
    });
}

export async function afterLoginWithGoogleHandler (user){
  const userWithEmail= await getUserByEmail(user.email);
  console.log("what's in get axios email:", userWithEmail);
  const existedEmail = userWithEmail.data.email;
  if(existedEmail === undefined){
    AddEmailVerifiedUserToDB(user.displayName, user.displayName, user.email);
    console.log("Google account login completed!")
  }
  window.location.href = ROUTES.HOME;
}