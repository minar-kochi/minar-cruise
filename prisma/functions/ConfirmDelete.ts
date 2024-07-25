import readline from "node:readline";
import { generateRandomDigits } from "./generateRandom";
import { Truculenta } from "next/font/google";

const prompt = (query: string) =>
  new Promise((resolve) => rl.question(query, resolve));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export async function ConfirmDelete({ message }: { message: string }) {
  const confirm = await prompt(`${message} Y/n \n`);
  if (confirm !== "Y") {
    rl.close();
    process.exit();
  }
  let confirmCode = false;
  let failed = 1;
  while (!confirmCode) {
    if (failed > 3) {
      console.error("Confirmation Failed.");
      console.error("please run again");
      process.exit();
    }
    let code = generateRandomDigits();

    const getCode = await prompt(`Please Enter ${code} to confirm \n`);
    console.log("Entered Code is : ", getCode);
    let parsedCode = parseInt(getCode as string);

    if (!isNaN(parsedCode) && parsedCode === code) {
      confirmCode = true;
    }
    failed++;
  }
  return true;
}
