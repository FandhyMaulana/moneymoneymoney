"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Wallet, Loader2, Mail, Lock } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardWrapper } from "@/components/shared/card-wrapper";
import { useAuthStore } from "@/stores/auth-store";
import { authService } from "@/services/auth.service";
import { loginSchema, LoginCredentials } from "@/types/auth";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      if (response.success && response.data) {
        const token = response.data.token;
        
        // We temporarily set the token so the subsequent 'me' request 
        // includes it in the Authorization header via the axios interceptor.
        useAuthStore.getState().setToken(token);
        
        try {
          const meResponse = await authService.me();
          
          if (meResponse.success && meResponse.data) {
            // Finalize login with both token and user data
            login(token, {
              id: meResponse.data.user_id,
              email: data.email,
            });
            toast.success("Welcome back!");
            router.push(callbackUrl);
          } else {
            // If fetching profile fails, we shouldn't consider the user logged in
            useAuthStore.getState().logout();
            toast.error("Failed to load user profile. Please try again.");
          }
        } catch (meError) {
          useAuthStore.getState().logout();
          // Error toast will be handled by axios interceptor
          console.error("Profile fetch error:", meError);
        }
      } else {
        toast.error(response.error || "Login failed");
      }
    } catch (error: any) {
      // Error is handled by axios interceptor toast
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="flex flex-col items-center text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xl ring-4 ring-primary/10">
          <Wallet className="size-8" />
        </div>
        <h2 className="mt-8 text-3xl font-bold tracking-tight">Welcome back</h2>
        <p className="mt-3 text-muted-foreground">
          Sign in to your account to manage your finances
        </p>
      </div>

      <CardWrapper className="border-none shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                {...register("email")}
                id="email"
                type="email"
                placeholder="name@example.com"
                className={`pl-10 h-12 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="text-xs font-medium text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium leading-none" htmlFor="password">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                {...register("password")}
                id="password"
                type="password"
                placeholder="••••••••"
                className={`pl-10 h-12 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                disabled={isLoading}
              />
            </div>
            {errors.password && (
              <p className="text-xs font-medium text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button 
            className="w-full h-12 text-base font-semibold transition-all hover:shadow-lg active:scale-[0.98]" 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </CardWrapper>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link 
          href="/register" 
          className="font-semibold text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
