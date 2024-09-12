// language-command.service.ts
import { Injectable } from '@angular/core';
import { htmlConfig } from './html';
import { kubernetesConfig } from './kubernetes';
import { bashConfig } from './bash';
import { pythonConfig } from './python';
import { LanguageConfig } from './language-config.interface';
import { javascriptConfig } from './javascript';
import { phpConfig } from './php';

@Injectable({
  providedIn: 'root',
})
export class LanguageCommandService {
  private commands: { [key: string]: LanguageConfig } = {
    html: htmlConfig,
    kubernetes: kubernetesConfig,
    bash: bashConfig,
    python: pythonConfig,
    javascript: javascriptConfig,
    php: phpConfig,
    // other languages can be added here
  };

  find(
    cmd: string,
    language: string,
  ): { cmd: string; lang: string[]; found: boolean } {
    const result: { cmd: string; lang: string[]; found: boolean } = {
      cmd: '',
      lang: [],
      found: false,
    };
    cmd = cmd.trim(); // Trim the command once outside the loop

    if (language && language != 'all') {
      // Only one language specified
      this.getLanguageById(language).cmds.forEach((command) => {
        // If command is an array, check if the trimmed command matches any command in the array
        if (command.includes(cmd)) {
          result.cmd = command[0]; // Set result.cmd to the first command in the array
          result.lang.push(language);
          result.found = true;
        }
      });
    } else {
      // Loop through each language's command list
      for (const lang of this.getEnabledLanguageKeys()) {
        // Iterate over each command or command array in the command list
        this.getLanguageById(lang).cmds.forEach((command) => {
          // If command is an array, check if the trimmed command matches any command in the array
          if (command.includes(cmd)) {
            result.cmd = command[0]; // Set result.cmd to the first command in the array
            result.lang.push(lang);
            result.found = true;
          }
        });
      }
    }

    return result;
  }

  getLanguageNames(): string[] {
    const languages: string[] = [];
    this.getEnabledLanguageKeys().forEach((element) => {
      languages.push(this.getLanguageNameById(element));
    });
    return languages;
  }

  getAllLanguageKeys(): string[] {
    return Object.keys(this.commands);
  }

  getEnabledLanguageKeys(): string[] {
    const languages: string[] = [];
    Object.keys(this.commands).forEach((element) => {
      if (this.isEnabled(element)) {
        languages.push(element);
      }
    });

    return languages;
  }

  getLanguageById(language: string): LanguageConfig {
    return this.commands[language] ?? {};
  }

  getLanguageNameById(language: string): string {
    return this.getAllLanguageKeys().includes(language)
      ? this.getLanguageById(language).name
      : language.toUpperCase();
  }

  isEnabled(language: string): boolean {
    let configEnabled = localStorage.getItem('enabled_' + language);

    if (configEnabled && configEnabled == 'false') {
      return false;
    }

    return true;
  }
}
