import { deriveKeyFromPassword, generateSalt } from "./crypto/crypto";

function App() {
  async function testKey() {
    const salt = generateSalt();
    const key = await deriveKeyFromPassword("afnan123", salt);
    console.log("Salt:", salt);
    console.log("Key:", key);
  }

  return <button onClick={testKey}>Test Key</button>;
}

export default App;