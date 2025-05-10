import { Document } from 'mongoose';
import UserModel from "../models/User";
import BaseActions from "./base";

interface IUser extends Document {
    name: string;
    email: string;
    createdAt: Date;
}

class UserActions extends BaseActions<IUser> { 
    protected model = UserModel;
    protected resourceName = 'user';
}

export default UserActions; 