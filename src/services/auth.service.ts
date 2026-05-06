import User from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { verifyGoogleIdToken } from '../utils/googleVerify';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const JWT_EXPIRES = '1h';

export const login = async(username:string, password:string) => {
  const user = await User.findOne({username: username}).populate('roles');
  if (!user) return null;

  const match = await bcrypt.compare(password, user.password);
  if (!match) return null;


  const payload = {username: user.username, email: user.email, roles: user.roles};
  const token = jwt.sign(payload, JWT_SECRET, {expiresIn: JWT_EXPIRES});
  return {user, token};
}

export const googleLogin = async(idToken: string) => {
  try {
    if (!idToken) {
      return {status: false, message: "Missing token"}
    }

    const googleUser = await verifyGoogleIdToken(idToken);

    if (!googleUser.email_verified) {
      return {status: false, message: "Email not verified"}
    }

    let user = await User.findOne({email: googleUser.email});

    if(!user) {
      // We must create GoogleUser model not user
      // user = new GoogleUser({
      //   username: googleUser.email,
      //   email: googleUser.email,
      //   name: googleUser.name,
      //   photoUrl: googleUser.picture
      // })
      // await user.save();
      console.log("User not exist", googleUser.email);
    }

    const token = jwt.sign({
      userId: googleUser.sub,
      email: googleUser.email,
      name: googleUser.name,
      photoUrl: googleUser.picture,
      roles:[{role: "READER", description: "From Google", active: true}]
    },
    process.env.JWT_SECRET as string,
    {expiresIn: '1h'}
  )
  return {status: true, token}
    
  } catch (err) {
    console.log("Error in google auth", err);
    return {status: false, message: "Invalid Google Token"}
  }
}