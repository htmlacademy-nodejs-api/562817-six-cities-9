import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { Command } from './command.interface.js';

type PackageJSONConfig = {
  version: string
}

export class VersionCommand implements Command {
  constructor(private readonly filePath: string = 'package.json') {}

  private isPackageJSONConfig(value: unknown): value is PackageJSONConfig {
    return (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value) &&
      Object.hasOwn(value, 'version')
    );
  }

  private readVersion(): string {
    const jsonContent = readFileSync(resolve(this.filePath), 'utf-8');
    const importedContent: unknown = JSON.parse(jsonContent);

    if (!this.isPackageJSONConfig(importedContent)) {
      throw new Error('Failed to parse json content.');
    }

    return importedContent.version;
  }

  public getName(): string {
    return '--version';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    try {
      const version = this.readVersion();
      console.info(`Node version: ${version}`);
    } catch (error: unknown) {
      console.error(`Failed read version from ${this.filePath}`);

      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }
}
