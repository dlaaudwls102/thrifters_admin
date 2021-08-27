
import config from '../config/config';
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'


const Firebase = firebase.default.initializeApp(config.firebase);

export const Providers = {
    google: new firebase.default.auth.GoogleAuthProvider()
}
export const auth = firebase.default.app().auth();
export const db = firebase.default.firestore();
export default Firebase;