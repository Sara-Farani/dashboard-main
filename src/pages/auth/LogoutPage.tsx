import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";
import { logger } from "../../utils/logger";

export default function LogoutPage() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      await logout();

      // اگر اطلاعات کاربر یا Token را در Storage نگهداری می‌کنید، حذف کنید.
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("user");

      navigate("/login", {
        replace: true,
        state: {
          message: "با موفقیت از حساب کاربری خارج شدید.",
        },
      });
    } catch (error) {
      logger.error("خطا در خروج از حساب کاربری", error);

      setErrorMessage(
        "خروج از حساب کاربری انجام نشد. لطفاً دوباره تلاش کنید.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void handleLogout();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(160deg,#B7BDC6_0%,#9AA1AC_30%,#5B6270_65%,#2E323A_100%)] p-4">
      <section className="w-full max-w-md rounded-xl bg-white p-6 text-right shadow-md">
        <h1 className="mb-3 text-xl font-bold text-white">
          خروج از حساب کاربری
        </h1>

        {isLoading && (
          <p className="text-sm text-white/70">
            در حال خروج از حساب کاربری...
          </p>
        )}

        {errorMessage && (
          <>
            <p className="mb-4 text-sm text-red-600">{errorMessage}</p>

            <button
              type="button"
              onClick={() => void handleLogout()}
              disabled={isLoading}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              تلاش مجدد
            </button>
          </>
        )}
      </section>
    </main>
  );
}