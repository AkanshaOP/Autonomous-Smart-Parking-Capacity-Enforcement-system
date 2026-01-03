// Simple hash function for blockchain-style logging
export async function generateHash(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export function formatHash(hash: string): string {
  return hash.slice(0, 8) + '...' + hash.slice(-8);
}

export function generateSlotId(index: number): string {
  const row = String.fromCharCode(65 + Math.floor(index / 5)); // A, B, C, D
  const col = (index % 5) + 1;
  return `${row}${col}`;
}

export function generateVehicleNumber(): string {
  const states = ['MH', 'DL', 'KA', 'TN', 'GJ', 'UP', 'RJ'];
  const state = states[Math.floor(Math.random() * states.length)];
  const district = Math.floor(Math.random() * 99).toString().padStart(2, '0');
  const series = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                 String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const number = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `${state}${district}${series}${number}`;
}
