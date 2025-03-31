export const generateOTP = () => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
  return { otp, otpExpiresAt };
};
