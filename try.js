import bs58 from "bs58";

const utf8Encode = new TextEncoder();

const code = "4182eef681997c1e28f662be9fa3bd4b8e46b25538";
console.log(bs58.encode(utf8Encode.encode(code)));
console.log(Buffer.from(bs58.decode(code)).toString("hex"));

console.log("");

const code2 = "TMuX7RyNmAyNiN6wXfpugBk4NQrNWAMHzc";
console.log(bs58.encode(utf8Encode.encode(code2)));
console.log(Buffer.from(bs58.decode(code2)).toString("hex").slice(0, -8));

const decodeBase58ToHexAndSlice = (str) =>
  Buffer.from(bs58.decode(str)).toString("hex").slice(0, -8);
console.log(decodeBase58ToHexAndSlice("TMuX7RyNmAyNiN6wXfpugBk4NQrNWAMHzc"));
