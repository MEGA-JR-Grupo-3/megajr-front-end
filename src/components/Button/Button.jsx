import Link from "next/link";
import React from "react";

function Button({ buttonText, buttonStyle }) {
  return (
    <Link href="/">
      <button
        className={`${buttonStyle} bg-[radial-gradient(circle_at_center,var(--primary)_0%,var(--secondary)_70%)] rounded-4xl p-2 text-[#ffffff] font-[600] w-[312px]`}
      >
        {buttonText}
      </button>
    </Link>
  );
}

export default Button;
