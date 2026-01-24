import { Module } from '@nestjs/common';
import {
  FirebaseAdminProvider,
  FirebaseAuthProvider,
  FirebaseDbProvider,
} from './firebase.providers';

@Module({
  providers: [FirebaseAdminProvider, FirebaseAuthProvider, FirebaseDbProvider],
  exports: [FirebaseAdminProvider, FirebaseAuthProvider, FirebaseDbProvider],
})
export class FirebaseModule {}
