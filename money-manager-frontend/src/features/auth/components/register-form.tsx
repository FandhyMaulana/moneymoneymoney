"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Wallet, Loader2, Mail, Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardWrapper } from "@/components/shared/card-wrapper";
import { authService } from "@/services/auth.service";
import { registerSchema, RegisterData } from "@/types/auth";

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      if (response.success) {
        toast.success("Account created successfully! Please sign in.");
        router.push("/login");
      } else {
        toast.error(response.error || "Registration failed");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
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
        <h2 className="mt-8 text-3xl font-bold tracking-tight">Create an account</h2>
        <p className="mt-3 text-muted-foreground">
          Join us to start managing your finances better
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
            <label className="text-sm font-medium leading-none" htmlFor="password">
              Password
            </label>
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

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                {...register("confirmPassword")}
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className={`pl-10 h-12 ${errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}`}
                disabled={isLoading}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs font-medium text-destructive">{errors.confirmPassword.message}</p>
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
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>
      </CardWrapper>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link 
          href="/login" 
          className="font-semibold text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
