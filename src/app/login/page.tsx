import { signIn, signUp } from "../actions";

// A plain server-rendered form. No client JavaScript needed: the two buttons
// submit to two different Server Actions via `formAction`. Errors come back as
// a ?error= query param (set by the actions when sign-in/up fails).
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main>
      <h1>Playground login</h1>
      <p className="muted">
        New here? Pick any email + password and hit <em>Sign up</em>. (Email
        confirmation is off for this throwaway project.)
      </p>

      {error && <p className="err">{error}</p>}

      <form className="login-form">
        <input name="email" type="email" placeholder="email" required />
        <input
          name="password"
          type="password"
          placeholder="password (min 6 chars)"
          minLength={6}
          required
        />
        <div className="buttons">
          <button formAction={signIn}>Sign in</button>
          <button className="ghost" formAction={signUp}>
            Sign up
          </button>
        </div>
      </form>
    </main>
  );
}
