export interface ISendOtp {
    email: string,
};

export interface IVerifyOtp {
    email: string,
    otp: string,
};

export interface ILogin {
    email: string,
    password: string,
}

// export interface Root {
//   name: string
//   email: string
//   password: string
//   role: string
//   isDeleted: boolean
//   isActive: string
//   isVerified: boolean
//   auths: Auth[]
//   _id: string
//   createdAt: string
//   updatedAt: string
// }

// export interface Auth {
//   provider: string
//   providerId: string
// }