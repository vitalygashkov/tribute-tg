export const verifyHmac = async (key: string, data: string, expectedHmac: string) => {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  const dataToVerify = encoder.encode(data);
  const cryptoKey = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, dataToVerify);
  const computedHmac = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return computedHmac === expectedHmac;
};
