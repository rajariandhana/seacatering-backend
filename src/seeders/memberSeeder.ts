import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";

export function generateSecureRandomString(length: number = 12): string {
  if (length < 8) {
    throw new Error("Password length must be at least 8 characters.");
  }

  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const specialChars = "!@#$%^&*()-_=+[]{}|;:,.<>?/";

  const allChars = lowercase + uppercase + numbers + specialChars;

  // Ensure at least one character from each required set
  const guaranteedChars = [
    lowercase[Math.floor(Math.random() * lowercase.length)],
    uppercase[Math.floor(Math.random() * uppercase.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
    specialChars[Math.floor(Math.random() * specialChars.length)],
  ];

  // Fill the rest of the string with random characters
  const remainingLength = length - guaranteedChars.length;
  const randomChars = Array.from({ length: remainingLength }, () =>
    allChars[Math.floor(Math.random() * allChars.length)]
  );

  // Combine and shuffle
  const passwordArray = guaranteedChars.concat(randomChars);

  // Shuffle using Fisher–Yates algorithm
  for (let i = passwordArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
  }

  return passwordArray.join('');
}

export async function seedMembers(faker:any, count:number){
  let users:any = [];
  for(let i=0; i<count; i++){
    let fullName = faker.person.fullName();
    let email = `${fullName.toLowerCase().replace(/ /g, '.')}@example.com`;
    let password = encrypt(generateSecureRandomString());
    users.push({fullName,email,password});
  }

  await UserModel.insertMany(users);
  console.log(`${count} users inserted`);
}