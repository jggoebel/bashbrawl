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
      for (const lang in this.commands) {
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
    Object.values(this.commands).forEach((element) => {
      languages.push(element.name);
    });
    return languages;
  }

  getLanguageKeys() {
    return Object.keys(this.commands);
  }

  getLanguageById(language: string) {
    return this.commands[language] ?? {};
  }

  getLanguageNameById(language: string) {
    return this.getLanguageKeys().includes(language)
      ? this.getLanguageById(language).name
      : language.toUpperCase();
  }
}
