export enum UserRole {
  User = "USER",
  Admin = "ADMIN",
}
export class User {
  id?: string;
  dateJoined!: Date;
  role!: UserRole;
  fullname!: string;
  avatar?: string;
  email!: string;
  static createFromDoc(id: string, doc: any): User {
    const user = new User();
    user.role = doc.role;
    user.fullname = doc.fullname;
    user.avatar = doc.avatar;
    user.email = doc.email;
    user.id = id;
    if (doc.dateJoined._seconds) {
      user.dateJoined = new Date(doc.dateJoined._seconds * 1000);
    } else {
      user.dateJoined = new Date(doc.dateJoined);
    }
    return user;
  }
  toObject(): object {
    return JSON.parse(JSON.stringify(this));
  }
}
