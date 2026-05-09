import React from "react"
import Link from "next/link"

const Page = () => {
  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl p-8">
        <img
          src="/survay-go.svg"
          alt="Survay Go"
          height={100}
          width={100}
          className="mx-auto object-contain object-bottom"
        />
        <div className="mb-6 space-y-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-black">
            Create your account
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign up with Google or use your email and a password.
          </p>
        </div>

        <div className="space-y-4">
          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-accent"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                fill="#EA4335"
                d="M12 10.2v3.9h5.4c-.2 1.3-1.6 3.9-5.4 3.9-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.8 3.6 14.6 2.7 12 2.7 6.9 2.7 2.7 6.9 2.7 12s4.2 9.3 9.3 9.3c5.4 0 9-3.8 9-9.1 0-.6-.1-1.1-.1-1.6H12Z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <form className="space-y-3">
            <label htmlFor="fullName" className="sr-only">
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="Full name"
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Email"
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Password (min. 8 characters)"
              minLength={8}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <label htmlFor="confirmPassword" className="sr-only">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Confirm password"
              minLength={8}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />

            <label className="flex cursor-pointer items-start gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                name="terms"
                required
                className="mt-1 size-4 shrink-0 rounded border-gray-300 text-black focus:ring-primary/20"
              />
              <span>
                I agree to the{" "}
                <a href="/terms" className="text-black underline underline-offset-2 hover:opacity-80">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-black underline underline-offset-2 hover:opacity-80">
                  Privacy Policy
                </a>
                .
              </span>
            </label>

            <button
              type="submit"
              className="w-full rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Create account
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-black underline underline-offset-2 hover:opacity-80"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page
