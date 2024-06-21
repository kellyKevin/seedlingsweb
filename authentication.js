import{ Injectable } from '@angular/core';
import {
    Auth,
    creaateUserWithEmailAndPassword,
    sendPasswordResetEmail,
    SigninWithEmailAndPassword,
    signOut,
    User,
    UserCredential,
} from '@angular/fire/auth';
import { doc, Firestore, setdoc } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    constructor(private readonly auth: Auth, private readonly firestore: Firestore) {}

getUser(): User {-
}

getUser$(): Observable<User> {-
}

login(email: String, password: string): Promise<UserCredential> {-
}

async signup(email: String, password: string): Promise<UserCredential> {
    try {
        const newUserCredential: UserCredential = await creaateUserWithEmailAndPassword(this.auth, email, password);

        const userProfileDocumentReference = doc(this.firestore, 'users/${newUserCredential.user.uid}');

        await setdoc(userProfileDocumentReference, {email});

        await sendEmailVerification(newUserCredential.user);

        return newUserCredential;
    } catch (error) {
        throw error;
    }
}

resetPassword(email: string): Promise<void> {-
}

logout(): Promise<void> {-
}
}