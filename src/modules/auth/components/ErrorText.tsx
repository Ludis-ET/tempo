import { getErrorMessages } from "@/lib/api-error";

function coerceMessages(input?: string | string[]): string[] {
  if (!input) return [];
  if (Array.isArray(input)) return input.filter((item) => item && item.trim()).map((item) => item.trim());
  return [input].filter((item) => item && item.trim()).map((item) => item.trim());
}

type ErrorTextProps = {
  error?: unknown;
  message?: string | string[];
  details?: string[];
};

export function ErrorText({ error, message, details }: ErrorTextProps) {
  const messages = new Set<string>();

  getErrorMessages(error).forEach((item) => messages.add(item));
  if (message) {
    coerceMessages(message).forEach((item) => messages.add(item));
  }
  if (details) {
    coerceMessages(details).forEach((item) => messages.add(item));
  }

  if (!messages.size) return null;

  const finalMessages = Array.from(messages);

  return (
    <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
      {finalMessages.length === 1 ? (
        <p>{finalMessages[0]}</p>
      ) : (
        <ul className="list-disc space-y-1 pl-5">
          {finalMessages.map((msg) => (
            <li key={msg}>{msg}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ErrorText;
