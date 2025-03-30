export const generateOTP = () => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  console.log("Generated OTP: ", otp);
  return otp;
};
