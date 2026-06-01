import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { signOut } from "@/app/actions/auth";

type NavbarProps = {
  userInitial?: string;
  boardName?: string;
  columnCount?: number;
};

export default function Navbar({ userInitial = "U", boardName, columnCount }: NavbarProps) {
  return (
    <header className="bg-white border-b border-[rgba(0,0,0,0.1)] sticky top-0 z-10">
      {/* Primary bar */}
      <div className="flex items-center justify-between h-[65px] px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="size-8" color="#00b800" />
            <span className="text-base text-[#0a0a0a]">FlowBoard</span>
          </Link>
          <Link href="/" className="text-base text-[#0a0a0a] hover:text-[#0369a1] transition-colors">
            Boards
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-[#6366f1] text-white text-xs font-medium rounded-full size-6 flex items-center justify-center">
            {userInitial}
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="text-base font-medium text-[#0a0a0a] hover:text-[#0369a1] transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>

      {/* Secondary breadcrumb bar (board view only) */}
      {boardName && (
        <div className="border-t border-[rgba(0,0,0,0.1)] flex items-center gap-3 h-[53px] px-8">
          <Link href="/" className="text-base font-medium text-[#717182] hover:text-[#0a0a0a] transition-colors">
            Boards
          </Link>
          <span className="text-[#717182]">/</span>
          <span className="text-2xl font-medium text-[#0a0a0a] tracking-tight">{boardName}</span>
          {columnCount !== undefined && (
            <span className="text-sm text-[#717182]">{columnCount} columns</span>
          )}
        </div>
      )}
    </header>
  );
}
