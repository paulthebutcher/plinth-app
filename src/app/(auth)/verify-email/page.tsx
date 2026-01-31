export default function VerifyEmailPage() {
  return (
    <div className="mx-auto max-w-[350px] space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Check your email
        </h1>
        <p className="text-sm text-muted-foreground">
          We&apos;ve sent you a verification link. Please check your email to continue.
        </p>
      </div>
    </div>
  )
}
