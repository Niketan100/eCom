import React from "react";

type GoogleSignInButtonProps = {
  onClick?: () => void;
  text?: string;
  disabled?: boolean;
};

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onClick,
  text = "Continue with Google",
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex mt-2 items-center justify-center gap-3 w-full px-4 py-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-100 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        className="w-5 h-5"
      >
        <path
          fill="#FFC107"
          d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
        />
        <path
          fill="#FF3D00"
          d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"
        />
        <path
          fill="#4CAF50"
          d="M24 44c5.2 0 10-2 13.5-5.2l-6.2-5.2C29.3 35.1 26.8 36 24 36c-5.2 0-9.6-3.3-11.1-8l-6.5 5C9.7 39.5 16.3 44 24 44z"
        />
        <path
          fill="#1976D2"
          d="M43.6 20.5H42V20H24v8h11.3c-1.1 3-3.3 5.4-6 6.8l6.2 5.2C39.8 36.1 44 30.7 44 24c0-1.3-.1-2.7-.4-3.5z"
        />
      </svg>

      <span className="text-sm font-medium text-gray-700">{text}</span>
    </button>
  );
};

export default GoogleSignInButton;
