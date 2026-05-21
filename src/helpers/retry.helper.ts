/**
 * RetryHelper — wraps flaky async operations with automatic retry logic.
 * Use this for external API calls, network-dependent assertions,
 * or any action that can transiently fail.
 */
export class RetryHelper {
  /**
   * Retries an async function up to `maxAttempts` times with a delay between retries.
   * Returns the result of the first successful attempt.
   * Throws the last error if all attempts fail.
   */
  static async retry<T>(
    fn: () => Promise<T>,
    options: { maxAttempts?: number; delayMs?: number; label?: string } = {}
  ): Promise<T> {
    const { maxAttempts = 3, delayMs = 1000, label = 'operation' } = options;
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (err) {
        lastError = err as Error;
        if (attempt < maxAttempts) {
          console.warn(`[RetryHelper] ${label} failed (attempt ${attempt}/${maxAttempts}): ${lastError.message}`);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
    }

    throw new Error(
      `[RetryHelper] ${label} failed after ${maxAttempts} attempts. Last error: ${lastError?.message}`
    );
  }

  /**
   * Polls a condition function until it returns true or the timeout expires.
   */
  static async waitUntil(
    condition: () => Promise<boolean>,
    options: { timeoutMs?: number; intervalMs?: number; label?: string } = {}
  ): Promise<void> {
    const { timeoutMs = 10000, intervalMs = 500, label = 'condition' } = options;
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
      if (await condition()) return;
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }

    throw new Error(`[RetryHelper] Timeout waiting for ${label} after ${timeoutMs}ms`);
  }
}
