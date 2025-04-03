import { createCipheriv, createDecipheriv, createHmac, randomBytes } from 'crypto';

export const signPaylaod = (payload: any, secretKey: string) => {
    return createHmac('sha256', secretKey).update(JSON.stringify(payload)).digest('hex');
}

export const verifyPayload = (payload: any, secretKey: string, sign: string) => {
    return sign === signPaylaod(payload, secretKey);
}

export const encrypt = (data: string, systemSecretKey: string) => {
    // Convert hex string to Buffer (32 bytes)
    const key = Buffer.from(systemSecretKey, 'hex');

    const iv = randomBytes(16); // Generate a random IV (16 bytes)
    const cipher = createCipheriv('aes-256-gcm', key, iv);

    const plaintext = Buffer.from(JSON.stringify(data), 'utf8');

    const encryptedContent = Buffer.concat([cipher.update(plaintext), cipher.final()]);
    const authTag = cipher.getAuthTag(); // Extract the authentication tag

    // Concatenate IV + authTag + encryptedContent and encode in base64
    return Buffer.concat([iv, authTag, encryptedContent]).toString('base64');
}

export const decrypt = (cipher: string, systemSecretKey: string) => {
    // Convert hex string to Buffer (32 bytes)
    const key = Buffer.from(systemSecretKey, 'hex');
    const buffer = Buffer.from(cipher, 'base64');

    // Extract IV, auth tag, and encrypted data
    const iv = buffer.subarray(0, 16);
    const authTag = buffer.subarray(16, 32);
    const encryptedContent = buffer.subarray(32);

    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
        decipher.update(encryptedContent),
        decipher.final(),
    ]);

    return JSON.parse(decrypted.toString('utf8'));
}