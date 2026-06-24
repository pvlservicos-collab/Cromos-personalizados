"use client";
import ResultScreen from "@/components/ResultScreen";

export default function VerPreco() {
  return (
    <ResultScreen
      stickerUrl="/figurinhamiguel.webp"
      stickerId="preview"
      onRetry={() => {}}
      checkoutUrl="https://buy.stripe.com/eVq5kD21lcOBfAx2vZ5Vu06"
      price="$3.500"
    />
  );
}
