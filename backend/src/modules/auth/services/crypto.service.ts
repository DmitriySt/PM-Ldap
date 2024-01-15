import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { scryptSync, createCipheriv, createDecipheriv } from 'node:crypto';

@Injectable()
export class CryptoService {
  private algorithm = 'aes-256-cbc';
  private key;

  constructor(private configService: ConfigService) {
    const password = configService.get('app.passSecret');
    const salt = configService.get('app.passSalt');
    this.key = scryptSync(password, salt, 32);
  }

  async crypt(value: string): Promise<string> {
    if (value.length === 0) return '';
    const iv = Buffer.alloc(16, 0);
    const cipher = createCipheriv(this.algorithm, this.key, iv);
    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  async decrypt(value: string): Promise<string> {
    if (value.length === 0) return '';
    const iv = Buffer.alloc(16, 0);
    const decipher = createDecipheriv(this.algorithm, this.key, iv);
    let decrypted = decipher.update(value, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
