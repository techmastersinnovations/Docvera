"use client";

import React from "react";

import ActionButton from "@/components/dashboard/ActionButton";

interface Props {
  messages: any[];

  message: string;

  setMessage: (
    value: string
  ) => void;

  handleSendMessage: () => void;
}

export default function ConsultationChat({
  messages,
  message,
  setMessage,
  handleSendMessage,
}: Props) {

  return (
    <div className="bg-card shadow-xl shadow-black/50/50 border border-white/10 rounded-3xl p-6 space-y-6">

      <h2 className="text-lg font-bold text-foreground">

        Consultation Chat

      </h2>

      <div className="space-y-4 max-h-[400px] overflow-y-auto">

        {messages.map(
          (msg) => (

            <div
              key={msg.id}
              className={`p-4 rounded-2xl max-w-[80%] ${
                msg.sender_role ===
                "DOCTOR"
                  ? "bg-card shadow-xl shadow-black/50/50 text-foreground ml-auto"
                  : "bg-card shadow-xl shadow-black/50/50 text-foreground"
              }`}
            >

              <p className="text-sm">

                {msg.message}

              </p>

            </div>

          )
        )}

      </div>

      <div className="flex gap-3">

        <input
          type="text"
          value={message}
          onChange={(e) =>
            setMessage(
              e.target.value
            )
          }
          placeholder="Type message..."
          className="flex-1 bg-card border border-white/10 rounded-xl px-4 py-3 text-foreground outline-none"
        />

        <ActionButton
          onClick={
            handleSendMessage
          }
        >
          Send
        </ActionButton>

      </div>

    </div>
  );
}