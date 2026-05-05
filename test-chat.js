async function test() {
  const res = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'user', content: 'hello' }] })
  });
  console.log("Headers:", Object.fromEntries(res.headers.entries()));
  console.log("Status:", res.status);
  const text = await res.text();
  console.log("Response:", text);
}
test();
