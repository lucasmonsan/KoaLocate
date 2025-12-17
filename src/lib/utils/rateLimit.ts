import { toast } from '$lib/components/toast/toast.svelte';

/**
 * Interface para configuração de rate limit
 */
interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  message?: string;
}

/**
 * Registro de tentativas por chave
 */
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

/**
 * Client-side rate limiter usando localStorage
 */
export class RateLimiter {
  private static storage = new Map<string, RateLimitRecord>();
  private static readonly STORAGE_KEY = 'rate_limit_';

  /**
   * Verifica se ação está permitida
   */
  static async check(key: string, config: RateLimitConfig): Promise<boolean> {
    const now = Date.now();
    const storageKey = this.STORAGE_KEY + key;

    // Tentar recuperar do localStorage
    let record = this.storage.get(storageKey);
    
    if (!record) {
      const stored = this.getFromStorage(storageKey);
      if (stored) {
        record = stored;
        this.storage.set(storageKey, record);
      }
    }

    // Se não existe ou expirou, criar novo registro
    if (!record || now >= record.resetAt) {
      record = {
        count: 1,
        resetAt: now + config.windowMs
      };
      this.storage.set(storageKey, record);
      this.saveToStorage(storageKey, record);
      return true;
    }

    // Incrementar contador
    record.count++;
    this.storage.set(storageKey, record);
    this.saveToStorage(storageKey, record);

    // Verificar limite
    if (record.count > config.maxAttempts) {
      const waitTime = Math.ceil((record.resetAt - now) / 1000);
      const message = config.message || `Aguarde ${waitTime}s antes de tentar novamente.`;
      toast.error(message);
      return false;
    }

    return true;
  }

  /**
   * Reseta limite para uma chave específica
   */
  static reset(key: string): void {
    const storageKey = this.STORAGE_KEY + key;
    this.storage.delete(storageKey);
    
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(storageKey);
    }
  }

  /**
   * Limpa todos os limites expirados
   */
  static cleanup(): void {
    const now = Date.now();
    
    this.storage.forEach((record, key) => {
      if (now >= record.resetAt) {
        this.storage.delete(key);
        
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem(key);
        }
      }
    });
  }

  /**
   * Salva no localStorage
   */
  private static saveToStorage(key: string, record: RateLimitRecord): void {
    if (typeof localStorage === 'undefined') return;
    
    try {
      localStorage.setItem(key, JSON.stringify(record));
    } catch (e) {
      // Falha silenciosa
    }
  }

  /**
   * Recupera do localStorage
   */
  private static getFromStorage(key: string): RateLimitRecord | null {
    if (typeof localStorage === 'undefined') return null;
    
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  }
}

/**
 * Presets comuns de rate limiting
 */
export const RateLimitPresets = {
  /**
   * Reviews: 3 por 10 minutos
   */
  REVIEW_CREATION: {
    maxAttempts: 3,
    windowMs: 10 * 60 * 1000, // 10 minutos
    message: 'Você atingiu o limite de avaliações. Aguarde antes de criar outra.'
  },

  /**
   * Pin creation: 5 por hora
   */
  PIN_CREATION: {
    maxAttempts: 5,
    windowMs: 60 * 60 * 1000, // 1 hora
    message: 'Você atingiu o limite de pins. Aguarde antes de criar outro.'
  },

  /**
   * Reports: 10 por hora
   */
  REPORT: {
    maxAttempts: 10,
    windowMs: 60 * 60 * 1000, // 1 hora
    message: 'Você atingiu o limite de reportes. Aguarde antes de reportar novamente.'
  },

  /**
   * Upload: 20 por hora
   */
  PHOTO_UPLOAD: {
    maxAttempts: 20,
    windowMs: 60 * 60 * 1000, // 1 hora
    message: 'Você atingiu o limite de uploads. Aguarde antes de enviar mais fotos.'
  },

  /**
   * Upvotes: 50 por minuto (prevenção de spam)
   */
  UPVOTE: {
    maxAttempts: 50,
    windowMs: 60 * 1000, // 1 minuto
    message: 'Aguarde um momento antes de votar novamente.'
  },

  /**
   * Favorites: 30 por minuto
   */
  FAVORITE: {
    maxAttempts: 30,
    windowMs: 60 * 1000, // 1 minuto
    message: 'Aguarde um momento antes de favoritar novamente.'
  }
};

/**
 * Hook para usar rate limiting
 */
export function useRateLimit(key: string, config: RateLimitConfig) {
  return {
    check: () => RateLimiter.check(key, config),
    reset: () => RateLimiter.reset(key)
  };
}

// Cleanup a cada 5 minutos
if (typeof window !== 'undefined') {
  setInterval(() => {
    RateLimiter.cleanup();
  }, 5 * 60 * 1000);
}

