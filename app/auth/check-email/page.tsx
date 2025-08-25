export default function CheckEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border p-8 text-center">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Check your email</h1>
        <p className="text-gray-600 mb-6">
          We've sent a verification link to your email address. Please click the link to verify your account and
          complete the signup process.
        </p>
        <p className="text-sm text-gray-500">
          Didn't receive the email? Check your spam folder or{" "}
          <button className="text-purple-600 hover:text-purple-500 font-medium">resend verification email</button>
        </p>
      </div>
    </div>
  )
}
