"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import ModeToggle from "./ModeToggle";

export default function LoginPanel() {
  const bubbles = Array.from({ length: 15 });

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-6xl h-[420px] md:h-[520px] flex flex-col md:flex-row relative">
        {/* LEFT PANEL */}
        <div className="md:w-1/2 w-full bg-blue-600 text-white p-10 flex flex-col justify-center items-center relative overflow-hidden">
          {bubbles.map((_, i) => {
            const size = Math.random() * 20 + 10;
            const left = Math.random() * 100;
            const duration = Math.random() * 10 + 5;
            const delay = Math.random() * 5;

            return (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white/30"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${left}%`,
                  bottom: "-50px",
                }}
                animate={{ y: [-0, -600], x: [0, Math.random() * 20 - 10] }}
                transition={{
                  duration,
                  delay,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "linear",
                }}
              />
            );
          })}

          <h1 className="text-3xl md:text-4xl font-bold text-center z-10 relative">
            Welcome to HydroSense
          </h1>
          <p className="mt-3 text-blue-100 text-center z-10 relative max-w-sm">
            Smart water monitoring made easy, efficient, and reliable.
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div className="md:w-1/2 w-full p-10 flex flex-col items-center justify-center gap-6">
          <ModeToggle />
          <SignedOut>
            <h2 className="text-2xl font-semibold text-gray-800">
              Get Started
            </h2>

            <div className="flex flex-col w-full gap-3 mt-2">
              <SignInButton mode="modal">
                <Button className="w-full py-3">Sign In</Button>
              </SignInButton>

              <SignUpButton mode="modal">
                <Button className="w-full py-3" variant="outline">
                  Create Account
                </Button>
              </SignUpButton>
            </div>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
