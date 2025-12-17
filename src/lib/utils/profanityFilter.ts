/**
 * Lista básica de palavras ofensivas (pt-BR)
 * Em produção, considere usar uma biblioteca como bad-words-ptbr
 */
const PROFANITY_LIST_PT = [
  // Adicionar palavras conforme necessário
  // Esta é uma lista mínima para demonstração
  'spam',
  'scam'
];

const PROFANITY_LIST_EN = [
  'spam',
  'scam',
  'fake'
];

/**
 * Filtro básico de profanidade
 */
export class ProfanityFilter {
  private static wordList = [...PROFANITY_LIST_PT, ...PROFANITY_LIST_EN];

  /**
   * Verifica se o texto contém profanidade
   */
  static contains(text: string): boolean {
    if (!text) return false;

    const normalized = text.toLowerCase().trim();
    
    return this.wordList.some(word => {
      const pattern = new RegExp(`\\b${word}\\b`, 'i');
      return pattern.test(normalized);
    });
  }

  /**
   * Remove ou censura palavras ofensivas
   */
  static censor(text: string, replacement = '***'): string {
    if (!text) return text;

    let censored = text;
    
    this.wordList.forEach(word => {
      const pattern = new RegExp(`\\b${word}\\b`, 'gi');
      censored = censored.replace(pattern, replacement);
    });

    return censored;
  }

  /**
   * Valida comentário antes de salvar
   */
  static validateComment(comment: string): { valid: boolean; message?: string } {
    if (!comment || comment.trim().length === 0) {
      return { valid: false, message: 'Comentário vazio' };
    }

    if (comment.length > 500) {
      return { valid: false, message: 'Comentário muito longo (máx. 500 caracteres)' };
    }

    if (this.contains(comment)) {
      return { valid: false, message: 'Comentário contém linguagem inapropriada' };
    }

    // Verificar spam (muita repetição)
    if (this.isSpam(comment)) {
      return { valid: false, message: 'Comentário detectado como spam' };
    }

    return { valid: true };
  }

  /**
   * Detecta spam básico
   */
  private static isSpam(text: string): boolean {
    // URLs excessivos
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const urls = text.match(urlPattern);
    if (urls && urls.length > 2) return true;

    // Caracteres repetidos (ex: "aaaaaaaa")
    const repeatedChars = /(.)\1{5,}/g;
    if (repeatedChars.test(text)) return true;

    // Maiúsculas excessivas (>70%)
    const uppercaseRatio = (text.match(/[A-Z]/g) || []).length / text.length;
    if (uppercaseRatio > 0.7 && text.length > 20) return true;

    return false;
  }

  /**
   * Adiciona palavra à lista (runtime)
   */
  static addWord(word: string): void {
    if (!this.wordList.includes(word.toLowerCase())) {
      this.wordList.push(word.toLowerCase());
    }
  }
}

